import { useReducer } from "react";
import { initialContext, postRequest, type Context } from "./shared";

type State = "editing" | "loading" | "error" | "complete";

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-state"; value: State };

type ReducerContext = Context & {
  state: State;
};

const reducer = (context: ReducerContext, event: Event): ReducerContext => {
  if (event.type === "update-username") {
    return { ...context, username: event.value };
  } else if (event.type === "update-state") {
    return { ...context, state: event.value };
  }
  return context;
};

export default function UseReducer() {
  const [context, send] = useReducer(reducer, {
    ...initialContext,
    state: "editing",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (context.state !== "loading" && context.state !== "complete") {
      send({ type: "update-state", value: "loading" });
      try {
        await postRequest(context);
        send({ type: "update-state", value: "complete" });
      } catch (_) {
        send({ type: "update-state", value: "error" });
      }
    }
  };

  if (context.state === "complete") {
    return <p>Done</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) =>
          send({ type: "update-username", value: e.target.value })
        }
      />
      <button type="submit" disabled={context.state === "loading"}>
        Confirm
      </button>
      {context.state === "error" && <p>Error occurred</p>}
    </form>
  );
}
