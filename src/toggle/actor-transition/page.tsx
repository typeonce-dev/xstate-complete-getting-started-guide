import { useActor } from "@xstate/react";
import { actor } from "./actor";

export default function Page() {
  const [snapshot, send] = useActor(actor);
  return (
    <button onClick={() => send({ type: "toggle" })}>
      {snapshot.context ? "On" : "Off"}
    </button>
  );
}
