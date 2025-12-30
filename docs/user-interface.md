# User Interface

## Layout & Navigation

-   **Root Layout**: `app/layout.tsx` - Handles fonts (Inter/Geist), global styles, and providers (Toaster).
-   **Dashboard Layout**: `app/dashboard/layout.tsx` - Implements the Sidebar navigation and top header.
-   **Navigation Components**:
    -   `nav-main.tsx`: Primary dashboard links.
    -   `app-sidebar.tsx`: The collapsible sidebar component using `shadcn/ui`.

## Dashboard Views

The dashboard (`app/dashboard/`) is organized by function:
-   **Tasks**: `dashboard/tasks/` - The main work center. Contains List, Kanban, and Matrix views.
-   **Projects**: `dashboard/projects/` - Project oversight.
-   **Users**: `dashboard/users/` - User settings and profile.
-   **Assistant**: Accessible via the `ChatInterface` overlay or dedicated page.

## Forms & Components

-   **Forms**: Located in `components/forms/`.
    -   Uses **React Hook Form** for state management.
    -   Uses **Zod** for schema validation.
    -   Example: `TaskForm` handles validation for title, dates, and priority.
-   **UI Library**: `components/ui/`.
    -   Button, Card, Input, etc., are reusable components from **Shadcn/UI**.

## Styling System

-   **Engine**: **Tailwind CSS v4**.
-   **Theming**:
    -   Global styles in `app/globals.css`.
    -   CSS Variables used for theme colors (likely `cva` - Class Variance Authority used for component variants).
    -   **Dark Mode**: Native support via `next-themes` (implied by `components/ui` patterns).
