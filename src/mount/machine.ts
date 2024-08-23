import { assign, fromPromise, setup } from "xstate";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const searchingActor = fromPromise(
  async ({ input }: { input: { query: string } }): Promise<Post[]> =>
    fetch(
      `https://jsonplaceholder.typicode.com/posts?title_like=${input.query}`
    ).then((response) => response.json())
);

export const machine = setup({
  types: {
    events: {} as
      | { type: "update-query"; value: string }
      | { type: "submit-search" },
    context: {} as { query: string; posts: Post[] },
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
  context: { query: "", posts: [] },
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
