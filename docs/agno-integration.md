# Agno AI Integration Guide - Doable

Agno (formerly Phidata) is a powerful framework for building agentic systems. For the **Doable** project, Agno will serve as the brain that orchestrates tool calls, handles task decomposition, and manages psychological analysis.

## Proposed Agent Architecture

Based on the requirements in `problem-statement.md`, we can implement specialized agents using Agno's `Agent` and `Team` classes.

### 1. Psychology & Ikigai Analyst

- **Role:** Analyzes user quiz data and "Whys" to build a psychological profile.
- **Tools:** Custom tools to write to `User` and `Task` models.
- **Workflow:**
  1. Trigger on quiz completion.
  2. Map life goals to specific task types.
  3. Determine Eisenhower Matrix priorities based on user personality.

### 2. Task Decomposer (The 5-Min Specialist)

- **Role:** Takes a complex goal (e.g., "Build a landing page") and breaks it down into 5-minute actionable substeps.
- **Implementation:** Use Agno's `structured_output` with a Pydantic model for `Substep`.
- **Reasoning:** Agno's `Reasoning` capability ensures the steps are logical and truly "micro".

### 3. Motivational Coach (Agentic HITL)

- **Role:** Monitors delayed tasks (reverse pomodoro) and sends notifications with personalized quotes.
- **Integration:** Uses the `Integration` model to send reminders via Email, Slack, etc.
- **Human-in-the-Loop:** Can ask the user if they need a "break" or a "re-alignment" if a task is consistently ignored.

## Agno Framework Patterns to Leverage

### Team Orchestration

Use an Agno `Team` to coordinate between the Decomposer and the Coach.

```python
from agno.agent import Agent
from agno.team import Team

decomposer = Agent(name="Decomposer", role="Break tasks into 5min steps")
coach = Agent(name="Coach", role="Motivation and timing")

doable_team = Team(
    members=[decomposer, coach],
    instructions=["Help the user make progress based on their Ikigai."]
)
```

### Knowledge Management (RAG)

Use Agno's **Knowledge Base** to store the user's past task history and "Ikigai context".

- **Embedder:** OpenAI or Gemini.
- **Vector DB:** LanceDB or PgVector.
- **Usage:** When a user says "I feel unmotivated", the agent retrieves their life goals and reminds them why their current tasks matter.

### MCP Integration

Doable should be exposed as an **MCP Server** via Agno. This allows the productivity agent to be used within other MCP-compliant environments (like Cursor or other AI IDEs).

## Implementation Steps (AI Team Recommendation)

1. **Define Tools:** Create Python tools in Agno for Mongoose DB interaction.
2. **Setup Workflows:** Use **Agno Workflows 2.0** for the multi-step quiz and task breakdown process.
3. **Observability:** Connect to **Langfuse** for tracing agent reasoning steps.
