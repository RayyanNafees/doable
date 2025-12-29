# Database Structure - Doable AI Agent

This document outlines the database schema for the Doable AI Productivity Agent, focusing on psychological task management, automated breakdown, and team suitabilty.

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ TASK : manages
    USER ||--o{ INTEGRATION : has
    USER ||--o{ PROJECT : owns
    PROJECT ||--o{ TASK : contains
    TASK ||--o{ SUBSTEP : decomposed_into
    PROJECT ||--o{ EMPLOYEE : assigned_to
    USER {
        string id PK
        string email
        string persona "e.g. Developer, PM"
        string ikigai "User's Ikigai summary"
        json psychology "Psychological profile / quiz results"
        string[] life_goals
    }
    TASK {
        string id PK
        string user_id FK
        string project_id FK
        string title
        string description
        string why "The personal connection/reason"
        int priority "1-5"
        string eisenhower_quadrant "Important-Urgent, etc."
        datetime due_date
        int effort_estimate_mins
        boolean is_completed
        datetime last_delayed_at
        boolean reverse_pomodoro_active
    }
    SUBSTEP {
        string id PK
        string task_id FK
        string title
        int duration_mins "Default 5min"
        boolean is_completed
    }
    PROJECT {
        string id PK
        string user_id FK
        string title
        string description
        string status
    }
    EMPLOYEE {
        string id PK
        string name
        json psychology "Skillset and personality matching"
        float past_completion_rate
    }
    INTEGRATION {
        string id PK
        string user_id FK
        string platform "Email, ClickUp, Todoist"
        json credentials "Encrypted access tokens"
        datetime last_synced_at
    }
```

## Key Entities & Psychological Context

### 1. User & Psychology

- **Ikigai & "Why":** Collected through a quiz to map daily tasks to long-term meaning.
- **Psychology:** Used to automatically categorize tasks in the Eisenhower Matrix (e.g., a person prone to procrastination might have tasks auto-triaged differently).

### 2. Task & Substeps

- **Automatic Decomposition:** Big tasks are broken into `SUBSTEP` entries (5-min blocks).
- **Reverse Pomodoro:** Tracked via `last_delayed_at` and `reverse_pomodoro_active`. If a task is delayed > 2 days, the UI/Agent triggers the "5 min work / 20 min rest" cycle.

### 3. Team & Project Management

- **Employee Matching:** The `EMPLOYEE` psychology is compared against `PROJECT` requirements and `TASK` types to recommend the best fit.
