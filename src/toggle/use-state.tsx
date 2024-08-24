import { useState } from "react";

type Context = boolean;
const initialContext = false;

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);
  return (
    <input
      type="checkbox"
      checked={context}
      onChange={() => setContext(!context)}
    />
  );
}
