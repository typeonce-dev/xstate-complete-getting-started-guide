import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <div>
      {snapshot.matches("Loading") ? (
        <span>Loading...</span>
      ) : snapshot.matches("Error") ? (
        <>
          <span>Error while loading notifications</span>
          {snapshot.can({ type: "fetch" }) && (
            <button onClick={() => send({ type: "fetch" })}>Reload</button>
          )}
        </>
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
