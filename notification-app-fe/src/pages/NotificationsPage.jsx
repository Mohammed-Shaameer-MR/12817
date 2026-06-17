import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { Log } from "../../../logging-middleware/logger.js";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { notifications, totalPages, loading, error } = useNotifications({
    page,
    limit: 10,
    filter,
  });

  const unreadCount = notifications.length;

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    await Log("frontend", "debug", "page", `Filter changed to ${newFilter}`);
  };

  const handlePageChange = async (_, newPage) => {
    setPage(newPage);
    await Log("frontend", "debug", "page", `Page changed to ${newPage}`);
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((notification) => notification.Type === filter);

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>

        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <Alert severity="info">No notifications found</Alert>
      )}

      {!loading && !error && filteredNotifications.length > 0 && (
        <Stack spacing={1.5}>
          {filteredNotifications.map((notification, index) => (
            <Box
              key={notification.ID ?? index}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography fontWeight={700}>
                {notification.Type ?? "Notification"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {notification.Message ?? "No message available"}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {notification.Timestamp ?? "No timestamp"}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}