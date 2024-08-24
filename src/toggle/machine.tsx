import { useMachine } from "@xstate/react";
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

export default function Machine() {
  const [snapshot, send] = useMachine(machine);
  return (
    <button onClick={() => send({ type: "toggle" })}>{snapshot.value}</button>
  );
}
