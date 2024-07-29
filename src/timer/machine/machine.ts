import { assign, fromCallback, sendTo, setup } from "xstate";

type TickTimeEvent = Readonly<{ type: "tick-time" }>;
type PauseEvent = Readonly<{ type: "pause" }>;

type CallbackEvent = PauseEvent;

export const machine = setup({
  types: {
    events: {} as Readonly<{ type: "restart" }> | TickTimeEvent | PauseEvent,
    context: {} as {
      time: number;
      interval: number | null;
    },
  },
  guards: {
    isCompleted: ({ context }) => context.time <= 0,
  },
  actors: {
    interval: fromCallback<CallbackEvent>(({ sendBack, receive }) => {
      const interval = setInterval(() => {
        sendBack({ type: "tick-time" } satisfies TickTimeEvent);
      }, 1000);

      const clear = () => {
        clearInterval(interval);
      };

      receive((event) => {
        if (event.type) {
          clear();
        }
      });

      return clear;
    }),
  },
  actions: {
    onTickTime: assign(({ context }) => ({ time: context.time - 1 })),
    onPauseTimer: sendTo("interval", { type: "pause" } satisfies CallbackEvent),
  },
}).createMachine({
  id: "use-state-machine",
  context: { time: 10, interval: null },
  initial: "Running",
  states: {
    Running: {
      invoke: {
        id: "interval",
        src: "interval",
      },
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
        restart: { target: "Running" },
      },
    },
    Completed: {
      type: "final",
    },
  },
});
