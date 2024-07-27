import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);
  return (
    <div>
      <div>
        <input
          type="text"
          value={snapshot.context.searchText}
          onChange={(e) =>
            send({ type: "updated-search-text", value: e.target.value })
          }
        />
      </div>

      {snapshot.matches("Searching") && <span>Loading...</span>}
      {snapshot.matches("SearchError") && (
        <span>{snapshot.context.searchError}</span>
      )}

      {snapshot.matches("OpenedMovie") ? (
        <div>
          <p>{snapshot.context.openedMovie?.name}</p>
          <button type="button" onClick={() => send({ type: "close-movie" })}>
            Close
          </button>
        </div>
      ) : (
        snapshot.context.movies.map((movie) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => send({ type: "open-movie", movieId: movie.id })}
          >
            {movie.name}
          </button>
        ))
      )}
    </div>
  );
}
