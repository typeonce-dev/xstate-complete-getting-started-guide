import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <button onClick={() => send({ type: "toggle" })}>
      {snapshot.context.toggle ? "On" : "Off"}
    </button>
  );
}
