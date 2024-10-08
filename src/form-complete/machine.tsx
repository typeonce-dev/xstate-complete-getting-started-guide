import { useActor } from "@xstate/react";
import { assertEvent, assign, fromPromise, setup } from "xstate";
import { initialContext, postRequest, type Context } from "./shared";

type Event =
  | { type: "update-username"; username: string }
  | { type: "submit"; event: React.FormEvent<HTMLFormElement> };

const submitActor = fromPromise(
  async ({
    input,
  }: {
    input: { event: React.FormEvent<HTMLFormElement>; context: Context };
  }) => {
    input.event.preventDefault();
    await postRequest(input.context);
  }
);

const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  actors: { submitActor },
}).createMachine({
  context: initialContext,
  initial: "Editing",
  states: {
    Editing: {
      on: {
        "update-username": {
          actions: assign(({ event }) => ({
            username: event.username,
          })),
        },
        submit: { target: "Loading" },
      },
    },
    Loading: {
      invoke: {
        src: "submitActor",
        input: ({ event, context }) => {
          assertEvent(event, "submit");
          return { event: event.event, context };
        },
        onError: { target: "Error" },
        onDone: { target: "Complete" },
      },
    },
    Error: {
      on: {
        "update-username": {
          actions: assign(({ event }) => ({
            username: event.username,
          })),
        },
        submit: { target: "Loading" },
      },
    },
    Complete: {},
  },
});

export default function Machine() {
  const [snapshot, send] = useActor(machine);

  if (snapshot.matches("Complete")) {
    return <p>Done</p>;
  }

  return (
    <form onSubmit={(event) => send({ type: "submit", event })}>
      <input
        type="text"
        value={snapshot.context.username}
        onChange={(e) =>
          send({ type: "update-username", username: e.target.value })
        }
      />
      <button type="submit" disabled={snapshot.matches("Loading")}>
        Confirm
      </button>
      {snapshot.matches("Error") && <p>Error occurred</p>}
    </form>
  );
}
