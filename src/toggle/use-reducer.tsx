import { useReducer } from "react";

type Event = { type: "toggle" };
type Context = boolean;
const initialContext = false;

export const reducer = (context: Context, event: Event): Context => {
  if (event.type === "toggle") {
    return !context;
  }

  return context;
};

export default function UseReducer() {
  const [value, send] = useReducer(reducer, initialContext);
  return (
    <button onClick={() => send({ type: "toggle" })}>
      {value ? "On" : "Off"}
    </button>
  );
}
