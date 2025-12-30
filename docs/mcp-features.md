# MCP Features Documentation

This project implements a **Model Context Protocol (MCP)** Server to act as an AI Personal Productivity Agent, as defined in the [Problem Statement](./problem-statement.md).

## Overview

The agent exposes tools that enable large language models (LLMs) to interact directly with the application's data and logic. This allows the AI to perform "agentic" behaviors such as managing tasks and retrieving information dynamically.

## Implemented Tools

### 1. `create_task`
*   **Description**: Adds a new task to the user's persistent to-do list.
*   **Purpose**: Fulfills the "Task Management" core functionality by allowing the agent to capture goals and to-dos from natural language inputs (e.g., "Remind me to submit the report").
*   **Parameters**:
    *   `title` (string): The name of the task.
    *   `description` (string, optional): Additional details.
    *   `priority` (number): 1-5 urgency level.
    *   `userId` (string): Owner of the task.
    *   `dueDate` (string, ISO date): When the task is due.

### 2. `list_tasks`
*   **Description**: Retrieves a filtered list of tasks for the user.
*   **Purpose**: Enables the agent to "Summarize my to-do list," "Find high-priority items," or check for completed tasks, supporting the "Natural Language Processing" and "Context Tracking" requirements.
*   **Parameters**:
    *   `userId` (string): The user to fetch tasks for.
    *   `isCompleted` (boolean, optional): Filter by status.
    *   `limit` (number): Control payload size.

## Planned MCP Expansion (Bonus/Roadmap)

Based on the USP and Bonus Objectives, future MCP tools could include:
*   **`break_down_task`**: AUTOMATICALLY breaking big tasks into 5-minute sub-steps using internal reasoning logic.
*   **`categorize_eisenhower`**: Analytics tool to fetch tasks and assign them to an Eisenhower quadrant based on "Urgency" and "Importance" metadata.
*   **`reverse_pomodoro`**: A tool to fetch delayed tasks and suggest a "5-min work / 20-min rest" schedule.

## Technical Architecture

*   **Framework**: `xmcp` (TypeScript MCP Framework)
*   **Transport**: HTTP (`/api/mcp`)
*   **Integration**: Seamlessly runs within the Next.js 16+ application context, sharing the same Mongoose models and database connections.
