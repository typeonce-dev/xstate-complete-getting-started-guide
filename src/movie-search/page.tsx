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

      {snapshot.context.movies.map((movie) => (
        <div key={movie.id}>{movie.name}</div>
      ))}
    </div>
  );
}
