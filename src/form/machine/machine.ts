import { assign, fromPromise, setup } from "xstate";

interface Context {
  username: string;
  age: number;
}

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-age"; value: number }
  | { type: "submit"; event: React.FormEvent<HTMLFormElement> };

export const initialState: Context = { username: "", age: 26 };

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
  id: "form-machine",
  context: initialState,
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
      },
    },
    Sending: {
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