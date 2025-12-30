import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize OpenTelemetry with Langfuse before any other imports
    const sdk = new NodeSDK({
      spanProcessors: [new LangfuseSpanProcessor()],
    });

    sdk.start();

    // Import database connection after telemetry is initialized
    await import('@/lib/models/connect');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize Edge specific monitoring or logging SDKs
  }
}
