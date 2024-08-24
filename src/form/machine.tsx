import { useMachine } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-age"; value: number }
  | { type: "submit"; event: React.FormEvent<HTMLFormElement> };

interface Context {
  username: string;
  age: number;
}
const initialContext: Context = { username: "", age: 26 };

const submit = fromPromise<void, { event: React.FormEvent<HTMLFormElement> }>(
  async ({ input }) => {
    input.event.preventDefault();
    await new Promise<boolean>((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 1000)
    );
  }
);

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  actors: { submit },
  actions: {
    onUpdateUsername: assign((_, { value }: { value: string }) => ({
      username: value,
    })),
    onUpdateAge: assign((_, { value }: { value: number }) => ({
      age: value,
    })),
  },
}).createMachine({
  context: initialContext,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "update-username": {
          actions: { type: "onUpdateUsername", params: ({ event }) => event },
        },
        "update-age": {
          actions: { type: "onUpdateAge", params: ({ event }) => event },
        },
        submit: { target: "Submitting" },
      },
    },
    Submitting: {
      invoke: {
        src: "submit",
        input: ({ event }) => {
          if (event.type === "submit") {
            return { event: event.event };
          }

          throw new Error("Unexpected event");
        },
        onDone: { target: "Complete" },
      },
    },
    Complete: {},
  },
});

export default function Machine() {
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
