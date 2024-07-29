import { assign, fromPromise, setup } from "xstate";

interface Notification {
  id: string;
  message: string;
}

export const machine = setup({
  types: {
    events: {} as Readonly<{ type: "fetch" }>,
    context: {} as {
      notifications: Notification[];
      error: string | null;
    },
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
    onError: assign(() => ({ error: "Error while loading notifications" })),
    onLoaded: assign(
      (_, { notifications }: { notifications: Notification[] }) => ({
        notifications,
      })
    ),
  },
}).createMachine({
  id: "notifications-machine",
  context: { notifications: [], error: null },
  initial: "NotLoaded",
  states: {
    NotLoaded: {
      on: {
        fetch: { target: "Loading" },
      },
    },
    Loading: {
      invoke: {
        src: "fetchNotifications",
        onError: { target: "Error", actions: { type: "onError" } },
        onDone: {
          target: "Loaded",
          actions: {
            type: "onLoaded",
            params: ({ event }) => ({ notifications: event.output }),
          },
        },
      },
    },
    Error: {},
    Loaded: {},
  },
});
