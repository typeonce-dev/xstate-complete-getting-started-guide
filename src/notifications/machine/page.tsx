import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <div>
      {snapshot.matches("NotLoaded") ? (
        <button onClick={() => send({ type: "fetch" })}>
          Click to load notifications
        </button>
      ) : snapshot.matches("Loading") ? (
        <span>Loading...</span>
      ) : snapshot.matches("Error") ? (
        <span>{snapshot.context.error}</span>
      ) : (
        <>
          {snapshot.context.notifications.map((notification) => (
            <p key={notification.id}>{notification.message}</p>
          ))}
        </>
      )}
    </div>
  );
}
