import { setup } from "xstate";

export const machine = setup({
  types: {
    events: {} as { type: "toggle" },
  },
}).createMachine({
  initial: "Off",
  states: {
    Off: { on: { toggle: { target: "On" } } },
    On: { on: { toggle: { target: "Off" } } },
  },
});
