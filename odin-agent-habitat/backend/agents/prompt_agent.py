import asyncio
from backend.agents.base_agent import BaseAgent


class PromptAgent(BaseAgent):
    name = "Prompt Agent"
    description = "Building optimized image generation prompts"

    async def run(self, task: dict) -> dict:
        await asyncio.sleep(1.8)
        title = task["title"]
        style = task.get("style_notes", "professional, clean")
        service = task["service_type"]

        prompts = [
            f"Prompt A (Primary):\n"
            f"  \"{title}, {style} style, cinematic lighting, ultra-sharp focus, "
            f"vibrant colors, {service} thumbnail, 16:9, hyper-detailed, trending on Behance\"",

            f"Prompt B (Alt — Dark Mode):\n"
            f"  \"{title}, dark cyberpunk aesthetic, neon accents, dramatic shadows, "
            f"professional {service} design, 4K, high contrast, editorial quality\"",

            f"Negative Prompt:\n"
            f"  \"blurry, low quality, watermark, text overlay, distorted, oversaturated, "
            f"amateur, stock photo look, flat lighting\"",
        ]

        content = f"IMAGE PROMPTS — {title}\n{'=' * 40}\n\n" + "\n\n".join(prompts)
        content += "\n\n[SIMULATED] Prompts ready for Midjourney / DALL·E / SD."
        return {"content": content, "type": "prompts"}
