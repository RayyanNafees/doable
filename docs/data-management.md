# Data Management

## User Management

-   **Model**: `User` (`lib/models/User.ts`)
-   **Key Fields**:
    -   `email`: Unique identifier.
    -   `persona`: Driving the AI's personality adaptation.
    -   `ikigai`: Core motivation data.
    -   `psychology`: Map of traits and quiz results.
    -   `lifeGoals`: Array of long-term objectives.

## Project Management

-   **Model**: `Project` (`lib/models/Project.ts`)
-   **Purpose**: Groups tasks under a common goal.
-   **Functionality**: Projects serve as containers for Tasks (`Task.projectId`). The Agent can "Process" a project to breakdown a high-level goal into actionable tasks.

## Employee Management

-   **Model**: `Employee` (`lib/models/Employee.ts`)
-   **Purpose**: Simulates a team environment or manages actual team members.
-   **Features**:
    -   Likely used for delegating tasks within the agentic simulation.

## Integration System

-   **Model**: `Integration` (`lib/models/Integration.ts`)
-   **Purpose**: Manages connections to external tools.
-   **Supported Types**:
    -   **Email**: For task extraction.
    -   **Calendar**: For scheduling (synced via Google Calendar API).
    -   **External Trackers**: ClickUp / Todoist (planned/implemented).
