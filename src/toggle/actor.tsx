import { useActor } from "@xstate/react";
import { fromTransition } from "xstate";

type Event = { type: "toggle" };
type Context = boolean;
const initialContext = false;

export const actor = fromTransition((context: Context, event: Event) => {
  if (event.type === "toggle") {
    return !context;
  }

  return context;
}, initialContext);

export default function Actor() {
  const [snapshot, send] = useActor(actor);
  return (
    <button onClick={() => send({ type: "toggle" })}>
      {snapshot.context ? "On" : "Off"}
    </button>
  );
}
