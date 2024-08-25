import { useActor } from "@xstate/react";
import { assign, setup } from "xstate";

type Event = { type: "toggle" };
type Context = { state: boolean };
const initialContext: Context = { state: false };

const machine = setup({
  types: {
    events: {} as Event,
    context: {} as Context,
  },
  actions: {
    onToggle: assign(({ context }) => ({ state: !context.state })),
  },
}).createMachine({
  context: initialContext,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        toggle: {
          target: "Idle",
          actions: "onToggle",
        },
      },
    },
  },
});

export default function MachineContext() {
  const [snapshot, send] = useActor(machine);
  return (
    <input
      type="checkbox"
      checked={snapshot.context.state}
      onChange={() => send({ type: "toggle" })}
    />
  );
}
