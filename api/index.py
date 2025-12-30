from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.cal import CalendarTools
from agno.db.sqlite import AsyncSqliteDb
from agno.os import AgentOS
from dotenv import load_dotenv
import os

load_dotenv("../.env")

# Mock Calendar tool using a local file or just memory for now
# For a real implementation, we would use Google Calendar API
# But for the challenge, a mock or tool that simulates it is fine


def schedule_meeting(event_name: str, start_time: str, duration_minutes: int = 30):
    """Schedules a meeting in the calendar.
    Args:
        event_name (str): Name of the event.
        start_time (str): Start time of the event (ISO format).
        duration_minutes (int): Duration in minutes.
    """
    return f"Meeting '{event_name}' scheduled for {start_time} (Duration: {duration_minutes} mins)."


def get_calendar_events():
    """Retrieves all calendar events."""
    return [
        {"event": "Project Standup", "time": "2025-12-30T10:00:00"},
        {"event": "Code Review", "time": "2025-12-30T14:00:00"},
    ]


def verify_task_completion(task_description: str, steps_taken: list[str]):
    """Self-reflection tool to verify if all steps of a task were completed.
    Args:
        task_description (str): The initial task.
        steps_taken (list[str]): The steps the agent has performed.
    """
    # This is a mock self-reflection logic
    return {
        "verified": True,
        "reflection": f"Target: {task_description}. Checked steps: {', '.join(steps_taken)}. Everything seems correct.",
    }


assistant = Agent(
    name="Doable Assistant",
    model=Gemini(id="gemini-2.0-flash-exp"),  # Using flash for speed
    db=AsyncSqliteDb(db_file="my_os.db"),
    instructions=[
        "You are the Doable AI Productivity Agent.",
        "You help users manage their tasks, goals, and schedule.",
        "You can schedule meetings and retrieve calendar events.",
        "Use the 'verify_task_completion' tool before finishing complex requests to ensure quality.",
        "Be concise, motivational, and helpful.",
        "Always refer back to the user's 'Why' if they seem discouraged.",
    ],
    tools=[schedule_meeting, get_calendar_events, verify_task_completion],
    markdown=True,
    monitoring=True,  # Enable built-in monitoring/observability
)

agent_os = AgentOS(
    id="doable-os",
    description="Doable Agentic OS",
    agents=[assistant],
)

from pydantic import BaseModel

app = agent_os.get_app()


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat(request: ChatRequest):
    response = await assistant.arun(request.message)
    return {"response": response.content}


if __name__ == "__main__":
    agent_os.serve(app="index:app", reload=True, port=8000)
