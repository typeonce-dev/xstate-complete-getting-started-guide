import { useMachine } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Event =
  | { type: "update-query"; value: string }
  | { type: "submit-search" };

type Context = { query: string; posts: Post[] };
const initialContext = { query: "", posts: [] };

const searchingActor = fromPromise(
  async ({ input }: { input: { query: string } }): Promise<Post[]> =>
    fetch(
      `https://jsonplaceholder.typicode.com/posts?title_like=${input.query}`
    ).then((response) => response.json())
);

export const machine = setup({
  types: {
    events: {} as Event,
    context: {} as Context,
  },
  actors: { searchingActor },
  actions: {
    onUpdatePosts: assign((_, { posts }: { posts: Post[] }) => ({
      posts,
    })),
    onUpdateQuery: assign((_, { query }: { query: string }) => ({
      query,
    })),
  },
}).createMachine({
  context: initialContext,
  initial: "Searching",
  states: {
    Searching: {
      invoke: {
        src: "searchingActor",
        input: ({ context }) => ({ query: context.query }),
        onDone: {
          target: "Idle",
          actions: {
            type: "onUpdatePosts",
            params: ({ event }) => ({ posts: event.output }),
          },
        },
      },
    },
    Idle: {
      on: {
        "update-query": {
          actions: {
            type: "onUpdateQuery",
            params: ({ event }) => ({ query: event.value }),
          },
        },
        "submit-search": {
          target: "Searching",
        },
      },
    },
  },
});

export default function Machine() {
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
