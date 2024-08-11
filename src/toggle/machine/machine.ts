import { setup } from "xstate";

type Event = { type: "toggle" };

export const machine = setup({
  types: {
    events: {} as Event,
  },
}).createMachine({
  initial: "Off",
  states: {
    Off: {
      on: {
        toggle: { target: "On" },
      },
    },
    On: {
      on: {
        toggle: { target: "Off" },
      },
    },
  },
});
