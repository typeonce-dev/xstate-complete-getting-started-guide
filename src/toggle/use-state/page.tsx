import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState<"On" | "Off">("Off");
  const toggle = () => setValue(value === "Off" ? "On" : "Off");
  return <button onClick={toggle}>{value}</button>;
}

function _Page() {
  const [value, setValue] = useState(false);
  const toggle = () => setValue(!value);
  return <button onClick={toggle}>{value}</button>;
}
