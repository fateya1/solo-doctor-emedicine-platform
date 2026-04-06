import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://26bb4596eabf255ecec121fe2ad74a4a@o4511175593164800.ingest.us.sentry.io/4511175623376896",
  environment: process.env.NODE_ENV ?? "production",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
