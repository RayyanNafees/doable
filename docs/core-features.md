# Core Features

## Psychology & AI Intelligence System

Doable differentiates itself by understanding the *User*, not just the *Task*.

-   **Ikigai Profiling**: The user's profile (`User.ts`) stores an `ikigai` field and `psychology` map.
-   **Persona Adaptation**: The AI agent adapts its tone and suggestions based on the user's defined persona (e.g., "Software Developer", "Product Manager").
-   **Motivational Nudges**: The system uses the user's psychological triggers to generate "Nudges" - motivating messages to encourage task completion.

## Task Management System

The Task entity (`Task.ts`) is the central unit of work.

### Lifecycle
1.  **Creation**: Tasks can be created manually or AI-generated from natural language.
2.  **Enrichment**: The AI analyzes the task to add:
    -   `why`: The deeper purpose behind the task.
    -   `eisenhowerQuadrant`: Auto-classification (Urgent/Important).
    -   `effortEstimateMins`: AI-predicted duration.
    -   `substeps`: Breakdown of complex tasks.
3.  **Execution**: Users can track progress, use a Reverse Pomodoro timer, or mark substeps.
4.  **Reflection**: Optional AI-guided reflection on completion.

### Views
-   **List View**: Standard linear view.
-   **Eisenhower Matrix**: 2x2 grid for prioritization.
-   **Calendar**: Time-blocked view of tasks.

## AI Assistant (Doable Assistant)

The **Doable Assistant** serves as the proactive interface for the user.

-   **Implementation**: Python FastMCP Server (`api/mcp_server.py`).
-   **Tools**:
    -   `ask_assistant`: General conversational QA.
    -   `schedule_task`: interface to calendar booking.
    -   `reflect_on_task`: Verifies completion and updates the DB.
    -   `list_calendar`: Retrieves context for scheduling.
-   **Integration**: The frontend `ChatInterface` communicates with this backend to execute these tools, providing a seamless "Agentic" experience.
