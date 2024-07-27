import { useMachine } from "@xstate/react";
import React from "react";
import { machine, type CellIndex } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <div>
      <pre>{JSON.stringify(snapshot.context.board)}</pre>
      {snapshot.matches("ChooseNames") ? (
        <div>
          <input
            type="text"
            value={snapshot.context.player1Name}
            onChange={(e) =>
              send({ type: "update-name-1", name: e.target.value })
            }
          />
          <input
            type="text"
            value={snapshot.context.player2Name}
            onChange={(e) =>
              send({ type: "update-name-2", name: e.target.value })
            }
          />
          <button
            type="button"
            disabled={!snapshot.can({ type: "start-game" })}
            onClick={() => send({ type: "start-game" })}
          >
            Start game
          </button>
        </div>
      ) : (
        <div>
          {snapshot.matches("End") ? (
            <div>
              <p>
                {snapshot.context.winner === 1
                  ? snapshot.context.player1Name
                  : snapshot.context.winner === 2
                  ? snapshot.context.player2Name
                  : "No one"}{" "}
                won!
              </p>
              <button
                type="button"
                onClick={() => send({ type: "restart-game" })}
              >
                Restart
              </button>
            </div>
          ) : (
            <div>
              <p>
                {snapshot.matches("Player1")
                  ? snapshot.context.player1Name
                  : snapshot.context.player2Name}{" "}
                is your turn!
              </p>
              <div
                style={{
                  display: "grid",
                  maxWidth: "fit-content",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                }}
              >
                {snapshot.context.board.map((row, r) => (
                  <React.Fragment key={r}>
                    {row.map((col, c) => (
                      <button
                        type="button"
                        key={c}
                        style={{
                          border: "1px solid #eee",
                          background: "transparent",
                          width: "100px",
                          height: "100px",
                        }}
                        disabled={
                          !snapshot.can({
                            type: "pick-cell",
                            cell: [r as CellIndex, c as CellIndex],
                            player: snapshot.matches("Player1") ? 1 : 2,
                          })
                        }
                        onClick={() =>
                          send({
                            type: "pick-cell",
                            cell: [r as CellIndex, c as CellIndex],
                            player: snapshot.matches("Player1") ? 1 : 2,
                          })
                        }
                      >
                        {col === 1 ? "X" : col === 2 ? "O" : null}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
