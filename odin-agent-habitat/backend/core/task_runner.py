import asyncio
import aiosqlite
from datetime import datetime
from backend.core.event_bus import broadcast
from backend.db.database import DB_PATH
from backend.agents.brief_agent import BriefAgent
from backend.agents.concept_agent import ConceptAgent
from backend.agents.prompt_agent import PromptAgent
from backend.agents.design_agent import DesignAgent
from backend.agents.qa_agent import QAAgent
from backend.agents.delivery_agent import DeliveryAgent

PIPELINE = [BriefAgent, ConceptAgent, PromptAgent, DesignAgent, QAAgent, DeliveryAgent]


async def _log(db: aiosqlite.Connection, task_id: int, agent_name: str, message: str):
    await db.execute(
        "INSERT INTO agent_logs (task_id, agent_name, message) VALUES (?, ?, ?)",
        (task_id, agent_name, message),
    )
    await db.commit()
    await broadcast({"type": "log", "task_id": task_id, "agent": agent_name, "message": message, "timestamp": datetime.utcnow().isoformat()})


async def _set_agent_status(db: aiosqlite.Connection, task_id: int, agent_name: str, status: str):
    await db.execute(
        "UPDATE agents SET status = ?, current_task_id = ? WHERE name = ?",
        (status, task_id if status == "working" else None, agent_name),
    )
    await db.commit()
    await broadcast({"type": "agent_status", "agent": agent_name, "status": status, "task_id": task_id})


async def _set_task_status(db: aiosqlite.Connection, task_id: int, status: str):
    await db.execute(
        "UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (status, task_id),
    )
    await db.commit()
    await broadcast({"type": "task_status", "task_id": task_id, "status": status})


async def run_pipeline(task_id: int):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        await _set_task_status(db, task_id, "running")

        row = await (await db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))).fetchone()
        task = dict(row)

        for AgentClass in PIPELINE:
            agent = AgentClass()
            await _set_agent_status(db, task_id, agent.name, "working")
            await _log(db, task_id, agent.name, f"Starting: {agent.description}")

            try:
                output = await agent.run(task)
                await db.execute(
                    "INSERT INTO outputs (task_id, agent_name, content, output_type) VALUES (?, ?, ?, ?)",
                    (task_id, agent.name, output["content"], output.get("type", "text")),
                )
                await db.commit()
                await broadcast({"type": "output", "task_id": task_id, "agent": agent.name, "content": output["content"], "output_type": output.get("type", "text")})
                await _log(db, task_id, agent.name, f"Complete.")
                await _set_agent_status(db, task_id, agent.name, "idle")
            except Exception as e:
                await _log(db, task_id, agent.name, f"ERROR: {e}")
                await _set_agent_status(db, task_id, agent.name, "idle")
                await _set_task_status(db, task_id, "failed")
                return

        await _set_task_status(db, task_id, "needs_review")
