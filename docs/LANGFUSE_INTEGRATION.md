# Langfuse Integration for Doable

This document explains how Langfuse observability is integrated into the Doable application for tracking and monitoring AI model performance.

## Overview

Langfuse is integrated via the Vercel AI SDK's OpenTelemetry support to provide:
- **Trace monitoring** for all AI model calls (Gemini)
- **Performance metrics** (latency, token usage, costs)
- **Error tracking** and debugging
- **User analytics** and usage patterns

## Architecture

### 1. OpenTelemetry Initialization (`instrumentation.ts`)

The OpenTelemetry SDK is initialized in `instrumentation.ts` which Next.js automatically loads before any other code:

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});

sdk.start();
```

**Why in `instrumentation.ts`?**
- Next.js 16+ automatically calls the `register()` function in this file
- Ensures telemetry is initialized before any AI SDK calls
- Works correctly with both Node.js and Edge runtimes

### 2. AI SDK Integration

All AI SDK calls (`generateText`, `streamText`) include the `experimental_telemetry` option:

```typescript
const result = await generateText({
  model: google("gemini-2.5-flash"),
  prompt: "...",
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'unique-function-identifier',
    metadata: {
      userId: user._id?.toString(),
      environment: process.env.NODE_ENV,
      // ... other custom metadata
    },
  },
});
```

### 3. Current Integrations

Langfuse tracing is enabled in:

1. **Chat Assistant** (`app/api/ai/chat/route.ts`)
   - Function ID: `chat-assistant`
   - Tracks: User conversations, tool calls, task creation

2. **Motivation Generator** (`lib/ai/motivation.ts`)
   - Function ID: `generate-motivation`
   - Tracks: Task-specific motivation generation
   - Metadata: Task ID, User ID

## Setup Instructions

### 1. Get Langfuse API Keys

1. Sign up at [https://cloud.langfuse.com](https://cloud.langfuse.com)
2. Create a new project
3. Go to Settings → API Keys
4. Copy your `Secret Key` and `Public Key`

### 2. Configure Environment Variables

Create a `.env.local` file (or add to your existing one):

```bash
# Langfuse Configuration
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key
LANGFUSE_BASE_URL=https://cloud.langfuse.com  # EU region
# LANGFUSE_BASE_URL=https://us.cloud.langfuse.com  # US region
```

### 3. Verify Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Make an AI call (e.g., use the chat assistant or trigger motivation generation)

3. Check your Langfuse dashboard at [https://cloud.langfuse.com](https://cloud.langfuse.com)

4. You should see traces appearing in the "Traces" section

## Viewing Traces in Langfuse

### Trace Structure

Each trace includes:
- **Span ID**: Unique identifier for the operation
- **Function ID**: The identifier you set (e.g., `chat-assistant`)
- **Model**: Which model was used (e.g., `gemini-2.5-flash`)
- **Input**: The prompt sent to the model
- **Output**: The model's response
- **Metadata**: Custom data (user ID, task ID, environment, etc.)
- **Performance**: Latency, token counts, estimated costs
- **Status**: Success/error status

### Useful Filters

In the Langfuse UI, you can filter by:
- **Function ID**: See all traces for a specific feature
- **User ID**: Track a specific user's AI interactions
- **Environment**: Separate dev/staging/production
- **Date Range**: Analyze trends over time
- **Status**: Find errors quickly

## Adding Langfuse to New AI Calls

When adding new AI SDK calls, follow this pattern:

```typescript
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function myNewAIFunction(input: string, userId: string) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: input,
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'my-new-function',  // Unique identifier
      metadata: {
        userId,
        environment: process.env.NODE_ENV || 'development',
        // Add any other relevant metadata
      },
    },
  });
  
  return text;
}
```

## Best Practices

1. **Use Descriptive Function IDs**: Make them kebab-case and descriptive (e.g., `task-parser`, `ikigai-analyzer`)

2. **Include Relevant Metadata**: Add context that helps debugging:
   - User IDs (for user-specific issues)
   - Task/Project IDs (for feature-specific tracking)
   - Environment (to separate dev/prod data)

3. **Monitor Costs**: Langfuse tracks token usage and can estimate costs

4. **Set Up Alerts**: Configure alerts in Langfuse for:
   - High error rates
   - Unusual latency
   - Cost thresholds

5. **Privacy**: Be careful not to log sensitive user data in metadata

## Troubleshooting

### Traces Not Appearing

1. **Check environment variables**: Ensure `LANGFUSE_SECRET_KEY` and `LANGFUSE_PUBLIC_KEY` are set
2. **Verify instrumentation.ts**: Make sure it's in the root directory
3. **Check console**: Look for OpenTelemetry initialization errors
4. **Restart dev server**: Changes to `instrumentation.ts` require a restart

### Incomplete Traces

1. **Check telemetry flag**: Ensure `experimental_telemetry.isEnabled: true`
2. **Verify SDK version**: Make sure you're using AI SDK v6+
3. **Check network**: Langfuse needs internet access to send traces

### Performance Impact

- OpenTelemetry adds minimal overhead (~1-5ms per request)
- Traces are sent asynchronously (non-blocking)
- For production, consider sampling if you have high traffic

## Additional Resources

- [Langfuse Documentation](https://langfuse.com/docs)
- [Vercel AI SDK Telemetry](https://sdk.vercel.ai/docs/ai-sdk-core/telemetry)
- [OpenTelemetry Docs](https://opentelemetry.io/docs/)

## Support

For issues with:
- **Langfuse**: [GitHub Issues](https://github.com/langfuse/langfuse/issues)
- **Vercel AI SDK**: [GitHub Discussions](https://github.com/vercel/ai/discussions)
- **This Integration**: Contact the Doable development team
