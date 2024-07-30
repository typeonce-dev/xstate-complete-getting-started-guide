import { useEffect, useState } from "react";

class ApiError {
  status: number;
  constructor(status: number) {
    this.status = status;
  }
}

interface Notification {
  id: string;
  message: string;
}

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(true);

  const onLoadNotification = async () => {
    if (!loading) {
      try {
        setError("");
        setLoading(true);
        const response = await new Promise<Notification[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: "1", message: "It's time to work" },
              { id: "2", message: "Up for a meeting?" },
            ]);
          }, 1200);
        });

        setOpen(true);
        setNotifications(response);
      } catch (e) {
        if (e instanceof ApiError && e.status >= 500) {
          setRetry(false);
          setError("Error while loading notifications");
        } else {
          setError("Error while loading notifications, please retry");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    onLoadNotification();
  }, []);

  return (
    <div>
      {!open ? (
        <>
          {loading && <span>Loading...</span>}
          {error.length > 0 && (
            <>
              <span>{error}</span>
              {retry && <button onClick={onLoadNotification}>Reload</button>}
            </>
          )}
        </>
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
