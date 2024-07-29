import { assign, fromCallback, not, setup } from "xstate";

type MouseMoveEvent = Readonly<{
  type: "mouse-move";
  position: [number, number];
}>;

type MouseNpcEvent = Readonly<{ type: "npc-move" }>;

const interpolate = (
  from: [number, number],
  to: [number, number],
  frac: number
): [number, number] => {
  const nx = from[0] + (to[0] - from[0]) * frac;
  const ny = from[1] + (to[1] - from[1]) * frac;
  return [nx, ny];
};

const pointDistance = (
  from: [number, number],
  to: [number, number]
): number => {
  const x = from[0] - to[0];
  const y = from[1] - to[1];
  return Math.sqrt(x * x + y * y);
};

export const machine = setup({
  types: {
    events: {} as MouseMoveEvent | MouseNpcEvent,
    context: {} as {
      position: [number, number];
      mousePosition: [number, number];
    },
  },
  actors: {
    moveMouse: fromCallback(({ sendBack }) => {
      const event = (e: MouseEvent) =>
        sendBack({
          type: "mouse-move",
          position: [e.clientX, e.clientY],
        } satisfies MouseMoveEvent);

      document.addEventListener("mousemove", event);
      return () => {
        document.removeEventListener("mousemove", event);
      };
    }),
    moveNcp: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: "npc-move" } satisfies MouseNpcEvent);
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }),
  },
  actions: {
    onMouseMove: assign((_, { position }: { position: [number, number] }) => ({
      mousePosition: position,
    })),
    onNpcMove: assign(({ context }) => ({
      position: interpolate(context.position, context.mousePosition, 0.1),
    })),
  },
  guards: {
    isNearby: ({ context }) =>
      pointDistance(context.position, context.mousePosition) <= 200,
    canAttack: ({ context }) =>
      pointDistance(context.position, context.mousePosition) <= 30,
  },
}).createMachine({
  id: "npc-machine",
  context: { position: [0, 0], mousePosition: [0, 0] },
  initial: "Idle",
  invoke: { src: "moveMouse" },
  on: {
    "mouse-move": {
      actions: { type: "onMouseMove", params: ({ event }) => event },
    },
  },
  states: {
    Idle: {
      always: {
        target: "Chasing",
        guard: "isNearby",
      },
    },
    Chasing: {
      invoke: { src: "moveNcp" },
      always: [
        {
          target: "Idle",
          guard: not("isNearby"),
        },
        {
          target: "Attacking",
          guard: "canAttack",
        },
      ],
      on: {
        "npc-move": {
          actions: { type: "onNpcMove" },
        },
      },
    },
    Attacking: {
      always: {
        target: "Chasing",
        guard: not("canAttack"),
      },
    },
  },
});
