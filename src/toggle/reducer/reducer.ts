type Event = { type: "toggle" };
type State = "On" | "Off";

export const reducer = (currentState: State, event: Event): State => {
  if (event.type === "toggle") {
    return currentState === "On" ? "Off" : "On";
  }

  return currentState;
};
