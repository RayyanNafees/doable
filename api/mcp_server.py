from mcp.server.fastmcp import FastMCP
from index import (
    assistant,
    schedule_meeting,
    get_calendar_events,
    verify_task_completion,
)

# Create an MCP server
mcp = FastMCP("Doable Assistant")


@mcp.tool()
async def ask_assistant(message: str) -> str:
    """Ask the Doable Assistant anything about tasks, goals, or schedule."""
    response = await assistant.arun(message)
    return response.content


@mcp.tool()
def schedule_task(title: str, start_time: str, duration: int = 30) -> str:
    """Schedule a task or meeting in the calendar."""
    return schedule_meeting(title, start_time, duration)


@mcp.tool()
def list_calendar() -> list:
    """List all scheduled events."""
    return get_calendar_events()


@mcp.tool()
def reflect_on_task(task: str, steps: list[str]) -> dict:
    """Verify if a task was completed successfully."""
    return verify_task_completion(task, steps)


if __name__ == "__main__":
    mcp.run()
