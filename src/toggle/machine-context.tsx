import { useActor } from "@xstate/react";
import { assign, setup } from "xstate";

type Event = { type: "toggle" };
type Context = { toggleValue: boolean };
const initialContext: Context = { toggleValue: false };

const machine = setup({
  types: {
    events: {} as Event,
    context: {} as Context,
  },
  actions: {
    onToggle: assign(({ context }) => ({ toggleValue: !context.toggleValue })),
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
      checked={snapshot.context.toggleValue}
      onChange={() => send({ type: "toggle" })}
    />
  );
}
