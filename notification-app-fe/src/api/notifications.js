import { Log } from "../../../logging-middleware/logger.js";

const NOTIFICATIONS_API_URL = "/evaluation-service/notifications";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb2hhbW1lZHNoYWFtZWVyNEBnbWFpbC5jb20iLCJleHAiOjE3ODE2ODAyNzEsImlhdCI6MTc4MTY3OTM3MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjY5MjIxODg5LWZmNGYtNDdkZC1hOGVkLTJlZmU3YjI0MTExNCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1vaGFtbWVkIHNoYWFtZWVyIG0uciIsInN1YiI6ImVhZTdjYWUxLTBkZTItNGQ2Zi1iMDE0LTA1OTg2Y2QyMjQ4ZCJ9LCJlbWFpbCI6Im1vaGFtbWVkc2hhYW1lZXI0QGdtYWlsLmNvbSIsIm5hbWUiOiJtb2hhbW1lZCBzaGFhbWVlciBtLnIiLCJyb2xsTm8iOiIxMjgxNyIsImFjY2Vzc0NvZGUiOiJqdUZwaHYiLCJjbGllbnRJRCI6ImVhZTdjYWUxLTBkZTItNGQ2Zi1iMDE0LTA1OTg2Y2QyMjQ4ZCIsImNsaWVudFNlY3JldCI6IlhSc2NrWHF0ellNRFZVUGoifQ.cmiAsfZzUlbBQ_5nlEoCNNtSvODwRYDCaiZTtR-VG54";

export async function fetchNotifications({
  page = 1,
  limit = 10,
  notificationType = "",
} = {}) {
  try {
    await Log(
      "frontend",
      "info",
      "api",
      `Fetching notifications: page=${page}, limit=${limit}, type=${notificationType || "All"}`
    );

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (notificationType && notificationType !== "All") {
      params.set("notification_type", notificationType);
    }

    const response = await fetch(`${NOTIFICATIONS_API_URL}?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (response.status === 401) {
      await Log(
        "frontend",
        "error",
        "auth",
        "Notifications API token expired or unauthorized"
      );

      throw new Error("Session expired. Please generate a new access token.");
    }

    if (!response.ok) {
      await Log(
        "frontend",
        "error",
        "api",
        `Notifications API failed with status ${response.status}`
      );

      throw new Error(`Notifications API failed with status ${response.status}`);
    }

    const data = await response.json();
    const notifications = data.notifications ?? [];

    await Log(
      "frontend",
      "info",
      "api",
      `Fetched ${notifications.length} notifications successfully`
    );

    return {
      notifications,
      total: data.total ?? notifications.length,
    };
  } catch (error) {
    await Log(
      "frontend",
      "fatal",
      "api",
      `Failed to fetch notifications: ${error.message}`
    );

    throw error;
  }
}
