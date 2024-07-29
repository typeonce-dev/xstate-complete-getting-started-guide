import { useState } from "react";

interface Notification {
  id: string;
  message: string;
}

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onLoadNotification = async () => {
    setNotifications([]);
    setIsLoading(true);
    try {
      const response = await new Promise<Notification[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: "1", message: "It's time to work" },
            { id: "2", message: "Up for a meeting?" },
          ]);
        }, 1200);
      });

      setNotifications(response);
    } catch (e) {
      setError("Error while loading notifications");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {notifications === null ? (
        <button onClick={onLoadNotification}>
          Click to load notifications
        </button>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : error !== null ? (
        <span>{error}</span>
      ) : (
        <>
          {notifications.map((notification) => (
            <p key={notification.id}>{notification.message}</p>
          ))}
        </>
      )}
    </div>
  );
}
