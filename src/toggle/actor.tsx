import { useActor } from "@xstate/react";
import { fromTransition } from "xstate";

type Event = { type: "toggle" };
type Context = boolean;
const initialContext = false;

const actor = fromTransition((context: Context, event: Event) => {
  if (event.type === "toggle") {
    return !context;
  }

  return context;
}, initialContext);

export default function Actor() {
  const [snapshot, send] = useActor(actor);
  return (
    <input
      type="checkbox"
      checked={snapshot.context}
      onChange={() => send({ type: "toggle" })}
    />
  );
}
