import asyncio
from backend.agents.base_agent import BaseAgent


class BriefAgent(BaseAgent):
    name = "Brief Agent"
    description = "Parsing client brief and extracting key requirements"

    async def run(self, task: dict) -> dict:
        await asyncio.sleep(1.5)
        title = task["title"]
        brief = task["brief"]
        service = task["service_type"]
        style = task.get("style_notes", "none specified")

        content = (
            f"BRIEF SUMMARY\n"
            f"{'=' * 40}\n"
            f"Project : {title}\n"
            f"Service : {service}\n"
            f"Style   : {style}\n\n"
            f"Key Requirements Extracted:\n"
            f"  - Deliverable type: {service}\n"
            f"  - Tone: {style if style else 'neutral/professional'}\n"
            f"  - Core message: {brief[:120]}{'...' if len(brief) > 120 else ''}\n\n"
            f"[SIMULATED] Brief parsed successfully. Handoff to Concept Agent."
        )
        return {"content": content, "type": "brief"}
