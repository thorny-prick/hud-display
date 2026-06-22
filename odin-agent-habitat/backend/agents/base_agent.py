from abc import ABC, abstractmethod


class BaseAgent(ABC):
    name: str = "Base Agent"
    description: str = "Base agent"

    @abstractmethod
    async def run(self, task: dict) -> dict:
        """Run the agent on a task. Return {"content": str, "type": str}."""
        ...
