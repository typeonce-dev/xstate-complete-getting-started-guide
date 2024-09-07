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
}).createMachine({
  context: initialContext,
  initial: "Idle",
  states: {
    Idle: {
      on: {
        toggle: {
          target: "Idle",
          actions: assign(({ context }) => ({
            toggleValue: !context.toggleValue,
          })),
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
