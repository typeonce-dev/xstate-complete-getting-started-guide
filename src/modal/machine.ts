import { assign, sendParent, setup } from "xstate";

type SendMessageEvent = Readonly<{ type: "send-message"; message: string }>;
type CloseEvent = Readonly<{ type: "close" }>;

export const modalContentMachine = setup({
  types: {
    events: {} as
      | Readonly<{ type: "update-message"; value: string }>
      | CloseEvent
      | Readonly<{ type: "send" }>,
    context: {} as Readonly<{
      message: string;
    }>,
  },
  actions: {
    onUpdateMessage: assign((_, { value }: { value: string }) => ({
      message: value,
    })),
    onSendMessage: sendParent(
      ({ context }) =>
        ({
          type: "send-message",
          message: context.message,
        } satisfies SendMessageEvent)
    ),
    onClose: sendParent({
      type: "close",
    } satisfies CloseEvent),
  },
}).createMachine({
  id: "modal-content-machine",
  context: { message: "" },
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "update-message": {
          actions: { type: "onUpdateMessage", params: ({ event }) => event },
        },
        send: {
          actions: { type: "onSendMessage" },
        },
        close: {
          actions: { type: "onClose" },
        },
      },
    },
  },
});

export const modalMachine = setup({
  types: {
    events: {} as Readonly<{ type: "open" }> | SendMessageEvent | CloseEvent,
    context: {} as { receivedMessage: string | null },
    children: {} as { modalContent: "modalContent" },
  },
  actors: {
    modalContent: modalContentMachine,
  },
  actions: {
    onGetMessage: assign((_, { message }: { message: string }) => ({
      receivedMessage: message,
    })),
  },
}).createMachine({
  id: "modal-machine",
  context: { receivedMessage: null },
  initial: "Closed",
  states: {
    Closed: {
      on: {
        open: { target: "Opened" },
      },
    },
    Opened: {
      invoke: {
        id: "modalContent",
        src: "modalContent",
      },
      on: {
        close: { target: "Closed" },
        "send-message": {
          target: "Closed",
          actions: { type: "onGetMessage", params: ({ event }) => event },
        },
      },
    },
  },
});
