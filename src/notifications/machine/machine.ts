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

const getNotifications = fromPromise(
  () =>
    new Promise<Notification[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "1", message: "It's time to work" },
          { id: "2", message: "Up for a meeting?" },
        ]);
      }, 1200);
    })
);

export const machine = setup({
  types: {
    events: {} as { type: "fetch" },
    context: {} as {
      notifications: Notification[];
      errorMessage: string;
      status: number | null;
    },
  },
  guards: {
    canReload: ({ context }) => context.status === null || context.status < 500,
  },
  actors: { getNotifications },
  actions: {
    onUpdateErrorMessage: assign((_, { error }: { error: unknown }) => ({
      status: error instanceof ApiError ? error.status : null,
      errorMessage: "Error while loading notifications",
    })),
    onUpdateNotifications: assign(
      (_, { notifications }: { notifications: Notification[] }) => ({
        notifications,
      })
    ),
  },
}).createMachine({
  context: {
    status: null,
    errorMessage: "",
    notifications: [
      { id: "1", message: "It's time to work" },
      { id: "2", message: "Up for a meeting?" },
    ],
  },
  initial: "Loading",
  states: {
    Loading: {
      invoke: {
        src: "getNotifications",
        onError: {
          target: "Error",
          actions: {
            type: "onUpdateErrorMessage",
            params: ({ event }) => ({ error: event.error }),
          },
        },
        onDone: {
          target: "Opened",
          actions: {
            type: "onUpdateNotifications",
            params: ({ event }) => ({ notifications: event.output }),
          },
        },
      },
    },
    Opened: {},
    Error: {
      on: {
        fetch: { guard: "canReload", target: "Loading" },
      },
    },
  },
});
