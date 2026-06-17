const LOG_API_URL = "/evaluation-service/logs";

const validStacks = ["backend", "frontend"];

const validLevels = ["debug", "info", "warn", "error", "fatal"];

const backendPackages = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];

const frontendPackages = ["api", "component", "hook", "page", "state", "style"];

const commonPackages = ["auth", "config", "middleware", "utils"];

const validPackages = [
  ...backendPackages,
  ...frontendPackages,
  ...commonPackages,
];

export async function Log(stack, level, packageName, message) {
  try {
    if (!validStacks.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}`);
    }

    if (!validLevels.includes(level)) {
      throw new Error(`Invalid level: ${level}`);
    }

    if (!validPackages.includes(packageName)) {
      throw new Error(`Invalid package: ${packageName}`);
    }

    if (stack === "frontend" && backendPackages.includes(packageName)) {
      throw new Error(`Package ${packageName} cannot be used with frontend`);
    }

    if (stack === "backend" && frontendPackages.includes(packageName)) {
      throw new Error(`Package ${packageName} cannot be used with backend`);
    }

    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb2hhbW1lZHNoYWFtZWVyNEBnbWFpbC5jb20iLCJleHAiOjE3ODE2ODAyNzEsImlhdCI6MTc4MTY3OTM3MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjY5MjIxODg5LWZmNGYtNDdkZC1hOGVkLTJlZmU3YjI0MTExNCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1vaGFtbWVkIHNoYWFtZWVyIG0uciIsInN1YiI6ImVhZTdjYWUxLTBkZTItNGQ2Zi1iMDE0LTA1OTg2Y2QyMjQ4ZCJ9LCJlbWFpbCI6Im1vaGFtbWVkc2hhYW1lZXI0QGdtYWlsLmNvbSIsIm5hbWUiOiJtb2hhbW1lZCBzaGFhbWVlciBtLnIiLCJyb2xsTm8iOiIxMjgxNyIsImFjY2Vzc0NvZGUiOiJqdUZwaHYiLCJjbGllbnRJRCI6ImVhZTdjYWUxLTBkZTItNGQ2Zi1iMDE0LTA1OTg2Y2QyMjQ4ZCIsImNsaWVudFNlY3JldCI6IlhSc2NrWHF0ellNRFZVUGoifQ.cmiAsfZzUlbBQ_5nlEoCNNtSvODwRYDCaiZTtR-VG54"}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Log API failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Logging failed:", error.message);
    return null;
  }
}
