import { useState } from "react";
import { initialContext, postRequest, type Context } from "./shared";

type State = "editing" | "loading" | "error" | "complete";

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);
  const [state, setState] = useState<State>("editing");

  const onUpdateUsername = (value: string) => {
    setContext({ username: value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state !== "loading" && state !== "complete") {
      setState("loading");
      try {
        await postRequest(context);
        setState("complete");
      } catch (_) {
        setState("error");
      }
    }
  };

  if (state === "complete") {
    return <p>Done</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) => onUpdateUsername(e.target.value)}
      />
      <button type="submit" disabled={state === "loading"}>
        Confirm
      </button>
      {state === "error" && <p>Error occurred</p>}
    </form>
  );
}
