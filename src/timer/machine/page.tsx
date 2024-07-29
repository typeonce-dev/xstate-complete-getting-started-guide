import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <div>
      <p>Time left: {snapshot.context.time} seconds</p>
      {snapshot.matches("Completed") ? (
        <p>Done!</p>
      ) : snapshot.matches("Paused") ? (
        <button onClick={() => send({ type: "restart" })}>Restart</button>
      ) : (
        <button onClick={() => send({ type: "pause" })}>Pause</button>
      )}

      {snapshot.matches("Paused") && <p>Paused</p>}
    </div>
  );
}
