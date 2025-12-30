# Development Guide

## Project Setup

### Prerequisites
-   Node.js 18+ (LTS recommended)
-   MongoDB Instance (Local or Atlas)
-   Python 3.10+ (For FastMCP Server)

### Installation

1.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file with:
    ```env
    MONGO_URI=mongodb+srv://...
    GOOGLE_API_KEY=...
    LANGFUSE_PUBLIC_KEY=...
    LANGFUSE_SECRET_KEY=...
    ```

### Running the App

1.  **Start Frontend (Next.js)**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`.

2.  **Start AI Server**:
    (Assuming standard python structure)
    ```bash
    python api/mcp_server.py
    ```

## Configuration & Build

-   **Next.js Config**: `next.config.ts` (Handles build plugins, rewrites).
-   **Tailwind**: Configured via CSS variables and `postcss` (v4 pattern).
-   **TypeScript**: Strict mode enabled in `tsconfig.json`.

## Server Actions Patterns

Server Actions in `app/actions/` follow a consistent pattern:

1.  **Validation**: Inputs are validated against Zod schemas.
2.  **Authentication**: Session/User is verified (Better-Auth).
3.  **Database Operation**: ID checks and Mongoose queries.
4.  **Revalidation**: `revalidatePath` is called to update Client Components.
5.  **Return**: Returns a standard Result object `{ success: boolean, data?: any, error?: string }` for easier UI handling.
