interface Context {
  username: string;
  age: number;
}

export const initialContext: Context = { username: "", age: 26 };

type Event =
  | { type: "update-username"; value: string }
  | { type: "update-age"; value: number };

export const reducer = (context: Context, event: Event): Context => {
  if (event.type === "update-username") {
    return { ...context, username: event.value };
  } else if (event.type === "update-age") {
    return {
      ...context,
      age: isNaN(event.value) ? context.age : event.value,
    };
  }

  throw new Error("Unexpected event");
};
