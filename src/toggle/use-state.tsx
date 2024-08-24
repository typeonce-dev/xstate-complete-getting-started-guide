import { useState } from "react";

type Context = boolean;
const initialContext = false;

export default function UseState() {
  const [value, setValue] = useState<Context>(initialContext);
  return (
    <button onClick={() => setValue(!value)}>{value ? "On" : "Off"}</button>
  );
}
