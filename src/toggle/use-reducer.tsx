import { useReducer } from "react";

type Event = { type: "toggle" };
type Context = boolean;

export const reducer = (context: Context, event: Event): Context => {
  if (event.type === "toggle") {
    return !context;
  }

  return context;
};

export default function UseReducer() {
  const [value, send] = useReducer(reducer, false);
  return (
    <button onClick={() => send({ type: "toggle" })}>
      {value ? "On" : "Off"}
    </button>
  );
}
