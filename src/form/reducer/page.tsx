import { useReducer } from "react";
import { initialContext, reducer } from "./reducer";

export default function Page() {
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
