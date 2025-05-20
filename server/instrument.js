const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://8f99d47630211a86c21b3316a59d5a3c@o4509352987525120.ingest.us.sentry.io/4509352988770304",
  sendDefaultPii: true,
})