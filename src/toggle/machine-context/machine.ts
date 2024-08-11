import { assign, setup } from "xstate";

type Event = { type: "toggle" };
type Context = { toggle: boolean };

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  actions: {
    onToggle: assign(({ context }) => ({
      toggle: !context.toggle,
    })),
  },
}).createMachine({
  initial: "Idle",
  context: { toggle: false },
  states: {
    Idle: {
      on: {
        toggle: {
          actions: { type: "onToggle" },
        },
      },
    },
  },
});
