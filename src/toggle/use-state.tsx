import { useState } from "react";

export default function UseState() {
  const [value, setValue] = useState(false);
  return (
    <button onClick={() => setValue(!value)}>{value ? "On" : "Off"}</button>
  );
}
