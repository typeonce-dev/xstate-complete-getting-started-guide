import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot, send] = useMachine(machine);

  if (snapshot.matches("Searching")) {
    return <p>Searching...</p>;
  }

  return (
    <div>
      <div>
        <input
          type="search"
          value={snapshot.context.query}
          onChange={(e) =>
            send({ type: "update-query", value: e.target.value })
          }
        />
        <button type="button" onClick={() => send({ type: "submit-search" })}>
          Search
        </button>
      </div>

      {snapshot.context.posts.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
