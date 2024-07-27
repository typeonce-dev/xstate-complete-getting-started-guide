import { assign, setup } from "xstate";

type Cell = 1 | 2 | null;
export type CellIndex = 0 | 1 | 2;

type Board = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];
const initBoard: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const checkWinner = (board: Board) =>
  board[0][0] !== null &&
  ((board[0][0] === board[0][1] && board[0][0] === board[0][2]) ||
    (board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
    (board[0][0] === board[0][1] && board[0][0] === board[0][2]))
    ? board[0][0]
    : board[0][1] !== null &&
      board[0][1] === board[1][1] &&
      board[0][1] === board[2][1]
    ? board[0][1]
    : board[0][2] !== null &&
      ((board[0][2] === board[1][2] && board[0][2] === board[2][2]) ||
        (board[0][2] === board[1][1] && board[0][2] === board[0][2]))
    ? board[0][2]
    : null;

export const machine = setup({
  types: {
    context: {} as Readonly<{
      player1Name: string;
      player2Name: string;
      winner: 1 | 2 | null;
      board: Board;
    }>,
    events: {} as
      | Readonly<{ type: "update-name-1"; name: string }>
      | Readonly<{ type: "update-name-2"; name: string }>
      | Readonly<{ type: "end-game"; winner: 1 | 2 | null }>
      | Readonly<{ type: "start-game" }>
      | Readonly<{ type: "restart-game" }>
      | Readonly<{
          type: "pick-cell";
          player: 1 | 2;
          cell: [CellIndex, CellIndex];
        }>,
  },
  guards: {
    isValidNames: ({ context }) =>
      context.player1Name.length > 0 &&
      context.player2Name.length > 0 &&
      context.player1Name !== context.player2Name,
    canPickCell: ({ context }, { cell }: { cell: [CellIndex, CellIndex] }) =>
      context.board[cell[0]][cell[1]] === null,
  },
  actions: {
    onUpdateName1: assign((_, { name }: { name: string }) => ({
      player1Name: name,
    })),
    onUpdateName2: assign((_, { name }: { name: string }) => ({
      player2Name: name,
    })),
    onGameEnded: assign((_, { winner }: { winner: 1 | 2 | null }) => ({
      winner,
    })),
    onRestartGame: assign({ board: initBoard, winner: null }),
    onPickCell: assign(
      (
        { context },
        { cell, player }: { player: 1 | 2; cell: [CellIndex, CellIndex] }
      ) => {
        let boardCopy: Board = [...context.board];
        boardCopy[cell[0]][cell[1]] = player;
        return { board: boardCopy };
      }
    ),
  },
}).createMachine({
  id: "tic-tac-toe-machine",
  context: {
    player1Name: "",
    player2Name: "",
    board: initBoard,
    winner: null,
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
      entry: ({ context, self }) => {
        const winner = checkWinner(context.board);
        if (winner !== null) {
          self.send({ type: "end-game", winner });
        }
      },
      on: {
        "end-game": {
          target: "End",
          actions: { type: "onGameEnded", params: ({ event }) => event },
        },
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
      entry: ({ context, self }) => {
        const winner = checkWinner(context.board);
        if (winner !== null) {
          self.send({ type: "end-game", winner });
        }
      },
      on: {
        "end-game": {
          target: "End",
          actions: { type: "onGameEnded", params: ({ event }) => event },
        },
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
    End: {
      on: {
        "restart-game": {
          target: "ChooseNames",
          actions: { type: "onRestartGame" },
        },
      },
    },
  },
});
