import asyncio
from backend.agents.base_agent import BaseAgent

CONCEPTS = [
    ("Split-screen contrast", "Left side dark/chaotic, right side clean/resolved — symbolizes transformation."),
    ("Central focal hero", "Bold subject center-frame with radial light burst. High drama, instant eye-catch."),
    ("Before/After reveal", "Diagonal split or peel effect showing the problem vs. the solution side by side."),
    ("Floating elements", "Subject surrounded by floating icons/text/badges that reinforce credibility."),
    ("Cinematic close-up", "Extreme crop on face/hands/product. Emotion-first, text minimal."),
]


class ConceptAgent(BaseAgent):
    name = "Concept Agent"
    description = "Generating thumbnail concept variations"

    async def run(self, task: dict) -> dict:
        await asyncio.sleep(2.0)
        title = task["title"]
        style = task.get("style_notes", "").lower()

        picks = CONCEPTS[:3]

        lines = [f"THUMBNAIL CONCEPTS — {title}", "=" * 40]
        for i, (name, desc) in enumerate(picks, 1):
            lines.append(f"\nConcept {i}: {name}")
            lines.append(f"  {desc}")

        lines.append("\n[SIMULATED] 3 concepts generated. Style flag: " + (style or "default"))
        lines.append("Recommended: Concept 1 — highest CTR pattern for this service type.")
        return {"content": "\n".join(lines), "type": "concepts"}
