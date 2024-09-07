import { useReducer } from "react";
import { initialContext, postRequest, type Context } from "./shared";

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-loading"; value: boolean };

type ReducerContext = Context & {
  loading: boolean;
};

const reducer = (context: ReducerContext, event: Event): ReducerContext => {
  if (event.type === "update-username") {
    return { ...context, username: event.value };
  } else if (event.type === "update-loading") {
    return { ...context, loading: event.value };
  }
  return context;
};

export default function UseReducer() {
  const [context, dispatch] = useReducer(reducer, {
    ...initialContext,
    loading: false,
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!context.loading) {
      dispatch({ type: "update-loading", value: true });
      await postRequest(context);
      dispatch({ type: "update-loading", value: false });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) =>
          dispatch({ type: "update-username", value: e.target.value })
        }
      />
      <button type="submit" disabled={context.loading}>
        Confirm
      </button>
    </form>
  );
}
