# Doable: AI Personal Productivity Agent
### BMW Challenge Submission

**DeepWiki & Advanced Documentation:** [https://deepwiki.com/RayyanNafees/doable](https://deepwiki.com/RayyanNafees/doable)

---

## 🚀 Project Overview

**Doable** is an intelligent, agentic assistant designed to redefine personal productivity. Built for the **BMW Challenge**, it goes beyond simple task tracking by integrating logical reasoning, psychological profiling, and external tools to act as a true partner in your workflow.

Tailored to specific personas (Software Developer, Product Manager, Team Leader), Doable bridges the gap between intent ("Schedule a coding session") and action (Calendar booking + Task creation) using a dual-backend architecture of **Next.js 16** and a **Python MCP Server**.

## 💡 Core Functionality

*   **Natural Language Processing**: Doable interprets complex goals like *"Summarize my to-do list and estimate effort"* or *"Schedule a 2-hour coding session after lunch"* using Google Gemini 2.5.
*   **Calendar Integration**: Two-way sync with Google Calendar to manage schedules effectively.
*   **Task Management**: Maintains "long-term memory" of tasks, handling priority ranking and deadlines automatically.
*   **Conversational Interface**: A human-like assistant that provides status updates, motivation, and reasoning.
*   **MCP Integration**: Exposes the agent's capabilities as a **Model Context Protocol (MCP) Server** (`api/mcp_server.py`).

## 🌟 Unique Features

Doable implements several innovative features to boost productivity and motivation:

-   **🧠 Psychology-Driven (Ikigai)**:
    -   Users take a psychology quiz during onboarding to identify their "Ikigai" (Reason for being).
    -   The AI uses this profile to explain the "Why" behind every task, making even mundane work feel meaningful.
-   **⏳ Reverse Pomodoro**:
    -   For tasks delayed by 1-2 days, Doable activates a unique timer: **Work 5 mins, Rest 20 mins**. This lowers the barrier to entry to get you started.
-   **🧩 Smart Task Breakdown**:
    -   Automatically decomposes large, vague tasks into actionable 5-minute sub-steps.
-   **⚖️ Automatic Eisenhower Matrix**:
    -   Uses psychological data and task metadata to auto-sort tasks into: *Do First, Schedule, Delegate, Don't Do*.
-   **🏢 Automated Project Planning**:
    -   Companies can input a raw project plan; Doable generates all required tasks and recommends the best employees based on their psychology and completion history.
-   **🔗 Ecosystem Integrations**:
    -   **Email**: Automatically creates tasks from flagged emails.
    -   **Tools**: Syncs with ClickUp and Todoist.
-   **🔔 Motivational Notifications**:
    -   Smart notifications for ignored tasks, featuring quotes and impact analysis: *"Skipping this task delays your goal of becoming a Senior Dev by 2 weeks."*

## 🎯 Bonus Objectives Achieved

*   **Self-Reflection**: The agent verifies its own actions (e.g., "Did I successfully book the meeting?") using the `reflect_on_task` tool.
*   **AI Observability (Langfuse)**: Full integration with **Langfuse** for tracing agent thought processes, monitoring token usage, and debugging complex reasoning steps.

## 🛠️ Technical Architecture

### Tech Stack
*   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Shadcn/UI.
*   **AI Engine**: Google Gemini 2.5 Flash (via Vercel AI SDK v5).
*   **Agent Server**: Python FastMCP (Model Context Protocol).
*   **Database**: MongoDB (Mongoose) for flexible document storage.
*   **Observability**: Langfuse (OpenTelemetry).

### Project Structure
```bash
d:\web\doable
├── app/                  # Next.js App Router
│   ├── api/ai/           # AI Routes (Chat, Process)
│   └── dashboard/        # Main User Interface
├── api/                  # Python MCP Server (Agent Logic)
│   └── mcp_server.py     # FastMCP Implementation
├── components/           # React Components (Shadcn)
├── lib/                  # Utilities & Models
│   ├── models/           # Mongoose Schemas (User, Task, Project)
│   └── ai/               # AI Prompts & Logic
└── docs/                 # Documentation & Slides
```

## 🔧 Getting Started

### Prerequisites
*   Node.js 18+ & Python 3.10+
*   MongoDB Instance
*   Google AI Studio API Key
*   Langfuse API Keys

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/RayyanNafees/doable.git
    cd doable
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file:
    ```env
    GOOGLE_API_KEY=your_key
    MONGO_URI=your_mongo_uri
    LANGFUSE_PUBLIC_KEY=pk-lf-...
    LANGFUSE_SECRET_KEY=sk-lf-...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

---

**Submitted for the BMW Challenge**
*Focused on: Context tracking, reasoning, tool orchestration, NLU, and time management logic.*
