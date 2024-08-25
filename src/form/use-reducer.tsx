import { useReducer } from "react";
import { initialContext, postRequest, type Context } from "./shared";

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-age"; value: number };

export const reducer = (context: Context, event: Event): Context => {
  if (event.type === "update-username") {
    return { ...context, username: event.value };
  }
  return context;
};

export default function UseReducer() {
  const [context, send] = useReducer(reducer, initialContext);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postRequest(context);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) =>
          send({ type: "update-username", value: e.target.value })
        }
      />
      <button type="submit">Confirm</button>
    </form>
  );
}
