# Langfuse Quick Reference

## 🚀 Quick Start (3 Steps)

1. **Get API Keys**: https://cloud.langfuse.com → Settings → API Keys
2. **Add to `.env.local`**:
   ```bash
   LANGFUSE_SECRET_KEY=sk-lf-...
   LANGFUSE_PUBLIC_KEY=pk-lf-...
   LANGFUSE_BASE_URL=https://cloud.langfuse.com
   ```
3. **Restart dev server**: `npm run dev`

## 📊 View Traces

Dashboard: https://cloud.langfuse.com → Traces

## ✨ Add Telemetry to New AI Calls

### For `generateText` or `streamText`:

```typescript
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const { text } = await generateText({
  model: google("gemini-2.5-flash"),
  prompt: "Your prompt here",
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'your-function-name',  // kebab-case
    metadata: {
      userId: userId,
      environment: process.env.NODE_ENV || 'development',
      // Add any other relevant context
    },
  },
});
```

### For `generateObject`:

```typescript
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const { object } = await generateObject({
  model: google("gemini-2.5-flash"),
  schema: yourZodSchema,
  prompt: "Your prompt here",
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'your-function-name',
    metadata: {
      // ... your metadata
    },
  },
});
```

## 🔍 Current Function IDs

| Function ID | File | What it tracks |
|------------|------|----------------|
| `chat-assistant` | `app/api/ai/chat/route.ts` | User chat |
| `generate-motivation` | `lib/ai/motivation.ts` | Motivational quotes |
| `process-project-plan` | `app/api/ai/process-project/route.ts` | Project tasks |
| `task-enrichment` | `app/actions/tasks.ts` | Task analysis |
| `generate-substeps` | `app/actions/tasks.ts` | Task breakdown |

## 🐛 Troubleshooting

**No traces appearing?**
1. Check `.env.local` has correct keys
2. Restart dev server
3. Check console for errors
4. Verify `instrumentation.ts` exists in project root

**Incomplete traces?**
- Ensure `experimental_telemetry.isEnabled: true`
- Check you're using AI SDK v6+

## 📚 Full Documentation

- **Integration Guide**: `docs/LANGFUSE_INTEGRATION.md`
- **Implementation Summary**: `docs/LANGFUSE_IMPLEMENTATION_SUMMARY.md`
- **Langfuse Docs**: https://langfuse.com/docs
