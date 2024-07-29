import { assign, setup } from "xstate";

export const machine = setup({
  types: {
    events: {} as
      | Readonly<{ type: "pause" }>
      | Readonly<{ type: "restart" }>
      | Readonly<{ type: "tick-time" }>,
    context: {} as {
      time: number;
    },
  },
  guards: {
    isCompleted: ({ context }) => context.time <= 0,
  },
  actions: {
    onTickTime: assign(({ context }) => ({ time: context.time - 1 })),
  },
}).createMachine({
  id: "use-state-machine",
  context: { time: 10 },
  initial: "Idle",
  states: {
    Running: {
      always: {
        target: "Completed",
        guard: "isCompleted",
      },
      on: {
        pause: { target: "Paused" },
        "tick-time": { actions: { type: "onTickTime" } },
      },
    },
    Paused: {
      on: {
        pause: { target: "Running" },
      },
    },
    Completed: {},
  },
});
