import { useState } from "react";
import { initialContext, postRequest, type Context } from "./shared";

type State = "Editing" | "Loading" | "Error" | "Complete";

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);
  const [state, setState] = useState<State>("Editing");

  const onUpdateUsername = (value: string) => {
    setContext({ username: value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state !== "Loading" && state !== "Complete") {
      setState("Loading");
      try {
        await postRequest(context);
        setState("Complete");
      } catch (_) {
        setState("Error");
      }
    }
  };

  if (state === "Complete") {
    return <p>Done</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) => onUpdateUsername(e.target.value)}
      />
      <button type="submit" disabled={state === "Loading"}>
        Confirm
      </button>
      {state === "Error" && <p>Error occurred</p>}
    </form>
  );
}
