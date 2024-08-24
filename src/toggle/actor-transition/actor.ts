import { fromTransition } from "xstate";

type Context = boolean;
type Event = { type: "toggle" };

export const actor = fromTransition((state: Context, event: Event) => {
  if (event.type === "toggle") {
    return !state;
  }

  return state;
}, false);
