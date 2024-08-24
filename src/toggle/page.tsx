import Actor from "./actor";
import Machine from "./machine";
import UseReducer from "./use-reducer";
import UseState from "./use-state";

export default function Page() {
  return (
    <>
      <UseState />
      <UseReducer />
      <Actor />
      <Machine />
    </>
  );
}
