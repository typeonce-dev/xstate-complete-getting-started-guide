import { assign, fromPromise, setup } from "xstate";

interface Movie {
  id: string;
  name: string;
}

const moviesDatabase = [
  { id: "1", name: "Shadows of the Past" },
  { id: "2", name: "The Lost City of Eldrador" },
  { id: "3", name: "Realms of Wonder" },
  { id: "4", name: "Echoes of Eternity" },
  { id: "5", name: "Stellar Horizon" },
  { id: "6", name: "The Great Prank War" },
  { id: "7", name: "The Weight of Memories" },
  { id: "8", name: "Love in the Time of Sunset" },
  { id: "9", name: "Whispers of the Heart" },
  { id: "10", name: "Quantum Rift" },
] satisfies Movie[];

export const machine = setup({
  types: {
    events: {} as Readonly<{ type: "updated-search-text"; value: string }>,
    context: {} as Readonly<{
      searchText: string;
      searchError: string;
      movies: Movie[];
    }>,
  },
  actors: {
    searching: fromPromise(
      ({ input }: { input: { searchText: string } }) =>
        new Promise<Movie[]>((resolve, reject) =>
          Math.random() < 0.1
            ? reject(new Error("Error while searching movie"))
            : setTimeout(() => {
                resolve(
                  moviesDatabase.filter((movie) =>
                    movie.name
                      .toLowerCase()
                      .includes(input.searchText.toLowerCase())
                  )
                );
              }, 1000)
        )
    ),
  },
  actions: {
    onUpdatedSearchText: assign((_, { value }: { value: string }) => ({
      searchText: value,
    })),
    onSearchedMovie: assign((_, { value }: { value: Movie[] }) => ({
      movies: value,
    })),
    onSearchedError: assign((_, { value }: { value: unknown }) => ({
      searchError: value instanceof Error ? value.message : "Unknown error",
    })),
  },
}).createMachine({
  id: "movie-search-machine",
  context: { searchText: "", searchError: "", movies: [] },
  initial: "Idle",
  on: {
    "updated-search-text": {
      target: ".UpdatedSearch",
      actions: { type: "onUpdatedSearchText", params: ({ event }) => event },
    },
  },
  states: {
    Idle: {},
    UpdatedSearch: {
      after: {
        600: {
          target: "Searching",
        },
      },
    },
    Searching: {
      invoke: {
        src: "searching",
        input: ({ context }) => ({ searchText: context.searchText }),
        onError: {
          target: "SearchError",
          actions: {
            type: "onSearchedError",
            params: ({ event }) => ({ value: event.error }),
          },
        },
        onDone: {
          target: "Idle",
          actions: {
            type: "onSearchedMovie",
            params: ({ event }) => ({ value: event.output }),
          },
        },
      },
    },
    SearchError: {},
  },
});
