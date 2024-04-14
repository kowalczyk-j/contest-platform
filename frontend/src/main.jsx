import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./components/index.css";
import "./static/style.css";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://eef59c7b79a8746b5ff8eac46e6d259d@o4507045238734848.ingest.us.sentry.io/4507087101952000",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
