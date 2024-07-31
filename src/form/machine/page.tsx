import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <form onSubmit={(event) => send({ type: "submit", event })}>
      <input
        type="text"
        value={snapshot.context.username}
        onChange={(e) =>
          send({ type: "update-username", value: e.target.value })
        }
      />
      <input
        type="number"
        value={snapshot.context.age}
        onChange={(e) =>
          send({ type: "update-age", value: e.target.valueAsNumber })
        }
      />
      <button type="submit">Confirm</button>
    </form>
  );
}
