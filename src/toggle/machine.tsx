import { useActor } from "@xstate/react";
import { setup } from "xstate";

type Event = { type: "toggle" };

const machine = setup({
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
  const [snapshot, send] = useActor(machine);
  return (
    <input
      type="checkbox"
      checked={snapshot.value === "On"}
      onChange={() => send({ type: "toggle" })}
    />
  );
}
