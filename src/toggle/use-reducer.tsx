import { useReducer } from "react";

type Event = { type: "toggle" };
type Context = boolean;
const initialContext = false;

const reducer = (context: Context, event: Event): Context => {
  if (event.type === "toggle") {
    return !context;
  }
  return context;
};

export default function UseReducer() {
  const [context, dispatch] = useReducer(reducer, initialContext);
  return (
    <input
      type="checkbox"
      checked={context}
      onChange={() => dispatch({ type: "toggle" })}
    />
  );
}
