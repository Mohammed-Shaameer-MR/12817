import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../../../logging-middleware/logger.js";

export function useNotifications({ page = 1, limit = 10, filter = "All" } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        await Log(
          "frontend",
          "info",
          "hook",
          `Loading notifications for page=${page}, filter=${filter}`
        );

        const data = await fetchNotifications({
          page,
          limit,
          notificationType: filter,
        });

        setNotifications(data.notifications ?? []);
        setTotal(data.total ?? 0);

        await Log("frontend", "info", "state", "Notification state updated");
      } catch (err) {
        setError(err.message);
        await Log("frontend", "error", "hook", err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, limit, filter]);

  const totalPages = Math.ceil(total / limit);

  return { notifications, total, totalPages, loading, error };
}