import { useMachine } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";
import { initialContext, postRequest, type Context } from "./shared";

type Event =
  | { type: "update-username"; username: string }
  | { type: "submit"; event: React.FormEvent<HTMLFormElement> };

const submitActor = fromPromise<
  void,
  { event: React.FormEvent<HTMLFormElement>; context: Context }
>(async ({ input }) => {
  input.event.preventDefault();
  await postRequest(input.context);
});

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  actors: { submitActor },
  actions: {
    onUpdateUsername: assign((_, { username }: { username: string }) => ({
      username,
    })),
  },
}).createMachine({
  context: initialContext,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "update-username": {
          actions: {
            type: "onUpdateUsername",
            params: ({ event }) => ({
              username: event.username,
            }),
          },
        },
        submit: { target: "Submitting" },
      },
    },
    Submitting: {
      invoke: {
        src: "submitActor",
        input: ({ event, context }) => {
          if (event.type === "submit") {
            return { event: event.event, context };
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
          send({ type: "update-username", username: e.target.value })
        }
      />
      <button type="submit">Confirm</button>
    </form>
  );
}
