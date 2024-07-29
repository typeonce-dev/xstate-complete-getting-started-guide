import { useMachine } from "@xstate/react";
import { machine } from "./machine";

export default function Page() {
  const [snapshot] = useMachine(machine);
  return (
    <div>
      <p>
        {snapshot.context.mousePosition[0]},{snapshot.context.mousePosition[1]}
      </p>
      <p>{snapshot.value}</p>
      <div
        style={{
          width: "10px",
          height: "10px",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: snapshot.matches("Attacking") ? "#ff0000" : "#111",
          transform: `translate(${snapshot.context.position[0]}px,${snapshot.context.position[1]}px)`,
        }}
      ></div>
    </div>
  );
}
