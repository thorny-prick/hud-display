import asyncio
from backend.agents.base_agent import BaseAgent


class DesignAgent(BaseAgent):
    name = "Design Agent"
    description = "Producing design specs and layout guidance"

    async def run(self, task: dict) -> dict:
        await asyncio.sleep(2.2)
        title = task["title"]
        style = task.get("style_notes", "modern, clean")

        spec = f"""DESIGN SPECIFICATION — {title}
{'=' * 40}

Canvas
  Size      : 1280 × 720 px (YouTube standard)
  Safe zone : 1154 × 648 px (margins: 63px all sides)

Typography
  Headline  : Bebas Neue / Anton — 96–120pt, white or neon
  Subhead   : Inter Bold — 48pt, secondary color
  Body      : Inter Regular — 32pt (avoid if possible)

Color Palette ({style})
  Primary   : #00FF88  (neon green — CTA, highlights)
  Secondary : #00D4FF  (cyan — accent)
  Background: #0A0A0F  (near-black)
  Surface   : #1A1A2E  (card/panel bg)
  Danger    : #FF3366  (error states)

Layout Zones
  Left 40%  : Subject / hero image
  Right 60% : Headline text + supporting info
  Bottom bar: Subtle gradient fade

Effects
  - Drop shadow on text: 4px blur, 60% opacity
  - Vignette overlay: 20% opacity radial
  - Optional glitch scan lines on background

[SIMULATED] Design spec generated. Export as PDF or Figma tokens on approval."""

        return {"content": spec, "type": "design_spec"}
