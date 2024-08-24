import Machine from "./machine";
import UseState from "./use-state";

export default function Page() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <UseState />
      </div>
      <div style={{ flex: 1 }}>
        <Machine />
      </div>
    </div>
  );
}
