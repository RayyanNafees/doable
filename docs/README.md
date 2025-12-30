# Doable - AI Personal Productivity Agent

Doable is an intelligent, agentic productivity platform that redefines task management. By leveraging advanced AI to understand context, reason about tasks, and integrate with your existing tools, Doable bridges the gap between intent and action.

## 🚀 Key Features

- **Agentic Task Management**: Not just a list. Doable understands the "Who", "What", and "Why" of your tasks.
- **Intelligent Dashboard**: A unified workspace with Eisenhower Matrix sorting and gamification metrics.
- **AI Integration**:
  - **Natural Language Parsing**: Convert raw text/voice into structured tasks and calendar events.
  - **Context Awareness**: Remembers recurring context and adapts to your persona.
  - **Multimodal capabilities**: Ready for Voice/Audio interactions (Gemini).
- **Gamification**: Earn XP, level up, and maintain streaks to boost motivation.
- **Integrations**: Syncs with external tools (Google Calendar, etc.) and offers an API-first design.
- **Observability**: Built-in integration with **Langfuse** for tracing and monitoring AI agent performance.

## 🛠️ Technology Stack

This project is built on a modern, high-performance stack:

### Core Framework
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)

### Data & Backend
- **Database**: MongoDB
- **ORM**: Mongoose (Primary), Drizzle ORM (Available)
- **Authentication**: Better-Auth

### Artificial Intelligence
- **SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (v5)
- **Models**: Google Gemini 2.5 Flash / OpenAI GPT-4o
- **Observability**: [Langfuse](https://langfuse.com/) (OpenTelemetry)

## 📂 Project Structure

```bash
📦 doable
├── 📂 app                 # Next.js App Router (Routes & Pages)
│   ├── 📂 api             # API Routes (AI endpoints, etc.)
│   ├── 📂 dashboard       # Main Application Dashboard
│   │   ├── 📂 tasks       # Task Management Views
│   │   ├── 📂 projects    # Project Management
│   │   └── 📂 users       # User Profile & Settings
│   └── 📂 integrations    # External Tool Integrations
├── 📂 components          # React Components
│   ├── 📂 ai              # AI-specific components (Chat, etc.)
│   ├── 📂 ui              # Reusable UI elements (Shadcn)
│   └── 📂 forms           # Form components (React Hook Form)
├── 📂 lib                 # Utilities & Logic
│   ├── 📂 ai              # AI Logic & Prompts
│   ├── 📂 models          # Mongoose/DB Models
│   └── 📂 types           # TypeScript Definitions
├── 📂 docs                # Documentation & Slides
└── 📄 instrumentation.ts  # OpenTelemetry/Langfuse setup
```

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database
- Google AI Studio API Key
- Langfuse Project (Optional but Recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/doable.git
    cd doable
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    # AI Keys
    GOOGLE_API_KEY=your_gemini_key_here

    # Database
    MONGO_URI=your_mongodb_connection_string

    # Observability (Langfuse)
    LANGFUSE_SECRET_KEY=sk-lf-...
    LANGFUSE_PUBLIC_KEY=pk-lf-...
    LANGFUSE_BASE_URL=https://cloud.langfuse.com
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🤝 Contribution

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
