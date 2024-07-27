import { assign, setup } from "xstate";

type Cell = 1 | 2 | null;

type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
const initBoard: Board = [
  null,
  null,
  null,
  // row2
  null,
  null,
  null,
  // row3
  null,
  null,
  null,
];

const checkWinner = (board: Board) =>
  board[0] !== null &&
  ((board[0] === board[1] && board[0] === board[2]) ||
    (board[0] === board[4] && board[0] === board[8]) ||
    (board[0] === board[3] && board[0] === board[6]))
    ? board[0]
    : board[1] !== null && board[1] === board[4] && board[1] === board[7]
    ? board[1]
    : board[2] !== null &&
      ((board[2] === board[5] && board[2] === board[8]) ||
        (board[2] === board[4] && board[2] === board[6]))
    ? board[2]
    : null;

export const machine = setup({
  types: {
    context: {} as Readonly<{
      player1Name: string;
      player2Name: string;
      board: Board;
    }>,
    events: {} as
      | Readonly<{ type: "update-name-1"; name: string }>
      | Readonly<{ type: "update-name-2"; name: string }>
      | Readonly<{ type: "start-game" }>
      | Readonly<{ type: "restart-game" }>
      | Readonly<{
          type: "pick-cell";
          player: 1 | 2;
          cell: number;
        }>,
  },
  guards: {
    isValidNames: ({ context }) =>
      context.player1Name.length > 0 &&
      context.player2Name.length > 0 &&
      context.player1Name !== context.player2Name,
    canPickCell: ({ context }, { cell }: { cell: number }) =>
      context.board[cell] === null,
    isComplete: ({ context }) => context.board.every((cell) => cell !== null),
    hasWinner: ({ context }) => checkWinner(context.board) !== null,
  },
  actions: {
    onUpdateName1: assign((_, { name }: { name: string }) => ({
      player1Name: name,
    })),
    onUpdateName2: assign((_, { name }: { name: string }) => ({
      player2Name: name,
    })),
    onRestartGame: assign({ board: initBoard }),
    onPickCell: assign(
      ({ context }, { cell, player }: { player: 1 | 2; cell: number }) => ({
        board: context.board.map((current, i) =>
          i !== cell ? current : player
        ) as Board,
      })
    ),
  },
}).createMachine({
  id: "tic-tac-toe-machine",
  context: {
    player1Name: "",
    player2Name: "",
    board: initBoard,
  },
  initial: "ChooseNames",
  states: {
    ChooseNames: {
      on: {
        "update-name-1": {
          actions: { type: "onUpdateName1", params: ({ event }) => event },
        },
        "update-name-2": {
          actions: { type: "onUpdateName2", params: ({ event }) => event },
        },
        "start-game": {
          target: "Player1",
          guard: "isValidNames",
        },
      },
    },
    Player1: {
      always: [
        {
          guard: "hasWinner",
          target: "Player2Win",
        },
        {
          guard: "isComplete",
          target: "NoWinner",
        },
      ],
      on: {
        "pick-cell": {
          target: "Player2",
          guard: {
            type: "canPickCell",
            params: ({ event }) => ({ cell: event.cell }),
          },
          actions: { type: "onPickCell", params: ({ event }) => event },
        },
      },
    },
    Player2: {
      always: [
        {
          guard: "hasWinner",
          target: "Player1Win",
        },
        {
          guard: "isComplete",
          target: "NoWinner",
        },
      ],
      on: {
        "pick-cell": {
          target: "Player1",
          guard: {
            type: "canPickCell",
            params: ({ event }) => ({ cell: event.cell }),
          },
          actions: { type: "onPickCell", params: ({ event }) => event },
        },
      },
    },
    NoWinner: {
      on: {
        "restart-game": {
          target: "ChooseNames",
          actions: { type: "onRestartGame" },
        },
      },
    },
    Player1Win: {
      on: {
        "restart-game": {
          target: "ChooseNames",
          actions: { type: "onRestartGame" },
        },
      },
    },
    Player2Win: {
      on: {
        "restart-game": {
          target: "ChooseNames",
          actions: { type: "onRestartGame" },
        },
      },
    },
  },
});
