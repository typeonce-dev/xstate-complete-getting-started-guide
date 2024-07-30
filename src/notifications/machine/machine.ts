import { assign, fromPromise, setup } from "xstate";

class ApiError {
  status: number;
  constructor(status: number) {
    this.status = status;
  }
}

interface Notification {
  id: string;
  message: string;
}

export const machine = setup({
  types: {
    events: {} as Readonly<{ type: "fetch" }>,
    context: {} as {
      notifications: Notification[];
      errorStatus: number | null;
    },
  },
  guards: {
    canRetry: ({ context }) =>
      context.errorStatus === null || context.errorStatus < 500,
  },
  actors: {
    fetchNotifications: fromPromise(
      () =>
        new Promise<Notification[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: "1", message: "It's time to work" },
              { id: "2", message: "Up for a meeting?" },
            ]);
          }, 1200);
        })
    ),
  },
  actions: {
    onError: assign((_, { error }: { error: unknown }) => ({
      errorStatus: error instanceof ApiError ? error.status : null,
    })),
    onLoaded: assign(
      (_, { notifications }: { notifications: Notification[] }) => ({
        notifications,
      })
    ),
  },
}).createMachine({
  id: "notifications-machine",
  context: { notifications: [], errorStatus: null },
  initial: "Loading",
  states: {
    Loading: {
      invoke: {
        src: "fetchNotifications",
        onError: {
          target: "Error",
          actions: { type: "onError", params: ({ event }) => event },
        },
        onDone: {
          target: "Loaded",
          actions: {
            type: "onLoaded",
            params: ({ event }) => ({ notifications: event.output }),
          },
        },
      },
    },
    Error: {
      on: {
        fetch: { target: "Loading", guard: "canRetry" },
      },
    },
    Loaded: {},
  },
});
