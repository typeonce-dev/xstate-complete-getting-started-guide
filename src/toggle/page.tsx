import Actor from "./actor";
import Machine from "./machine";
import MachineContext from "./machine-context";
import UseReducer from "./use-reducer";
import UseState from "./use-state";

export default function Page() {
  return (
    <>
      <UseState />
      <UseReducer />
      <Actor />
      <Machine />
      <MachineContext />
    </>
  );
}
