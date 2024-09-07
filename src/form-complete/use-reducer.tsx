import { useReducer } from "react";
import { initialContext, postRequest, type Context } from "./shared";

type State = "Editing" | "Loading" | "Error" | "Complete";

type Event =
  | { type: "update-username"; value: string }
  | { type: "request-start" }
  | { type: "request-complete" }
  | { type: "request-fail" };

type ReducerContext = Context & {
  state: State;
};

const reducer = (context: ReducerContext, event: Event): ReducerContext => {
  if (event.type === "update-username") {
    return { ...context, username: event.value };
  } else if (event.type === "request-start") {
    return { ...context, state: "Loading" };
  } else if (event.type === "request-complete") {
    return { ...context, state: "Complete" };
  } else if (event.type === "request-fail") {
    return { ...context, state: "Error" };
  }
  return context;
};

export default function UseReducer() {
  const [context, dispatch] = useReducer(reducer, {
    ...initialContext,
    state: "Editing",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (context.state !== "Loading" && context.state !== "Complete") {
      dispatch({ type: "request-start" });
      try {
        await postRequest(context);
        dispatch({ type: "request-complete" });
      } catch (_) {
        dispatch({ type: "request-fail" });
      }
    }
  };

  if (context.state === "Complete") {
    return <p>Done</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) =>
          dispatch({ type: "update-username", value: e.target.value })
        }
      />
      <button type="submit" disabled={context.state === "Loading"}>
        Confirm
      </button>
      {context.state === "Error" && <p>Error occurred</p>}
    </form>
  );
}
