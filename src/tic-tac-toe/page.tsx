import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <div>
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
          {snapshot.matches("Player1Win") ||
          snapshot.matches("Player2Win") ||
          snapshot.matches("NoWinner") ? (
            <div>
              <p>
                {snapshot.matches("Player1Win")
                  ? snapshot.context.player1Name
                  : snapshot.matches("Player2Win")
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
            <p>
              {snapshot.matches("Player1")
                ? snapshot.context.player1Name
                : snapshot.context.player2Name}{" "}
              is your turn!
            </p>
          )}

          <div>
            <div
              style={{
                display: "grid",
                maxWidth: "fit-content",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              }}
            >
              {snapshot.context.board.map((cell, i) => (
                <button
                  type="button"
                  key={i}
                  style={{
                    border: "1px solid #eee",
                    background: "transparent",
                    width: "100px",
                    height: "100px",
                  }}
                  disabled={
                    !snapshot.can({
                      type: "pick-cell",
                      cell: i,
                      player: snapshot.matches("Player1") ? 1 : 2,
                    })
                  }
                  onClick={() =>
                    send({
                      type: "pick-cell",
                      cell: i,
                      player: snapshot.matches("Player1") ? 1 : 2,
                    })
                  }
                >
                  {cell === 1 ? "X" : cell === 2 ? "O" : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
