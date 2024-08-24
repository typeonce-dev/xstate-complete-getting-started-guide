import { useReducer } from "react";

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-age"; value: number };

interface Context {
  username: string;
  age: number;
}
export const initialContext: Context = { username: "", age: 26 };

export const reducer = (context: Context, event: Event): Context => {
  if (event.type === "update-username") {
    return { ...context, username: event.value };
  } else if (event.type === "update-age") {
    return {
      ...context,
      age: isNaN(event.value) ? context.age : event.value,
    };
  }

  return context;
};

export default function UseReducer() {
  const [context, send] = useReducer(reducer, initialContext);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await new Promise<boolean>((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 1000)
    );
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
      <input
        type="number"
        value={context.age}
        onChange={(e) =>
          send({ type: "update-age", value: e.target.valueAsNumber })
        }
      />
      <button type="submit">Confirm</button>
    </form>
  );
}
