import Machine from "./machine";
import UseReducer from "./use-reducer";
import UseState from "./use-state";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <UseState />
      </div>
      <div style={{ flex: 1 }}>
        <UseReducer />
      </div>
      <div style={{ flex: 1 }}>
        <Machine />
      </div>
    </div>
  );
}
