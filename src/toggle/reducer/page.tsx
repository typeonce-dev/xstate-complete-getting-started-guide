import { useReducer } from "react";
import { reducer } from "./reducer";

export default function Page() {
  const [value, send] = useReducer(reducer, "Off");
  return <button onClick={() => send({ type: "toggle" })}>{value}</button>;
}
