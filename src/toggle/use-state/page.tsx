import { useState } from "react";

export default function Page() {
  const [value, setValue] = useState<"On" | "Off">("Off");
  const toggle = () => setValue(value === "Off" ? "On" : "Off");
  return <button onClick={toggle}>{value}</button>;
}
