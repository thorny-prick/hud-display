import asyncio
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.db.database import get_db
from backend.core import task_runner

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskCreate(BaseModel):
    title: str
    brief: str
    service_type: str
    style_notes: Optional[str] = ""


class TaskUpdate(BaseModel):
    status: str


@router.post("/")
async def create_task(payload: TaskCreate, db=Depends(get_db)):
    cur = await db.execute(
        "INSERT INTO tasks (title, brief, service_type, style_notes) VALUES (?, ?, ?, ?)",
        (payload.title, payload.brief, payload.service_type, payload.style_notes),
    )
    await db.commit()
    task_id = cur.lastrowid
    asyncio.create_task(task_runner.run_pipeline(task_id))
    return {"id": task_id, "status": "pending"}


@router.get("/")
async def list_tasks(db=Depends(get_db)):
    rows = await (await db.execute("SELECT * FROM tasks ORDER BY created_at DESC")).fetchall()
    return [dict(r) for r in rows]


@router.get("/{task_id}")
async def get_task(task_id: int, db=Depends(get_db)):
    row = await (await db.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Task not found")
    return dict(row)


@router.patch("/{task_id}/status")
async def update_task_status(task_id: int, payload: TaskUpdate, db=Depends(get_db)):
    await db.execute(
        "UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (payload.status, task_id),
    )
    await db.commit()
    return {"id": task_id, "status": payload.status}


@router.get("/{task_id}/logs")
async def get_task_logs(task_id: int, db=Depends(get_db)):
    rows = await (await db.execute(
        "SELECT * FROM agent_logs WHERE task_id = ? ORDER BY timestamp ASC", (task_id,)
    )).fetchall()
    return [dict(r) for r in rows]


@router.get("/{task_id}/outputs")
async def get_task_outputs(task_id: int, db=Depends(get_db)):
    rows = await (await db.execute(
        "SELECT * FROM outputs WHERE task_id = ? ORDER BY created_at ASC", (task_id,)
    )).fetchall()
    return [dict(r) for r in rows]
