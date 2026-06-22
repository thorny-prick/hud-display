import asyncio
from backend.agents.base_agent import BaseAgent

CHECKS = [
    ("Brief coverage",      "PASS", "All brief requirements addressed by pipeline"),
    ("Concept viability",   "PASS", "3 concepts generated, ≥1 recommended"),
    ("Prompt completeness", "PASS", "Primary + Alt + Negative prompts present"),
    ("Design spec",         "PASS", "Canvas size, typography, palette, layout defined"),
    ("Safe zone compliance","PASS", "Layout respects 1154×648 safe area"),
    ("Style consistency",   "PASS", "Style notes applied across all outputs"),
    ("File readiness",      "WARN", "Actual image files not yet generated (simulation mode)"),
]


class QAAgent(BaseAgent):
    name = "QA Agent"
    description = "Running quality checks across all pipeline outputs"

    async def run(self, task: dict) -> dict:
        await asyncio.sleep(1.5)

        lines = [f"QA REPORT — {task['title']}", "=" * 40, ""]
        passed = warned = failed = 0
        for check, status, note in CHECKS:
            icon = {"PASS": "[PASS]", "WARN": "[WARN]", "FAIL": "[FAIL]"}[status]
            lines.append(f"  {icon}  {check}")
            lines.append(f"         {note}")
            if status == "PASS": passed += 1
            elif status == "WARN": warned += 1
            else: failed += 1

        lines.append("")
        lines.append(f"Result: {passed} passed / {warned} warnings / {failed} failed")
        lines.append("")
        if failed == 0:
            lines.append("VERDICT: READY FOR REVIEW — proceed to Delivery Agent.")
        else:
            lines.append("VERDICT: ISSUES FOUND — review required before delivery.")

        lines.append("\n[SIMULATED] QA complete.")
        return {"content": "\n".join(lines), "type": "qa_report"}
