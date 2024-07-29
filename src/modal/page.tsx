import { useMachine, useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import { modalMachine, type modalContentMachine } from "./machine";

const ModalContent = ({
  actor,
}: {
  actor: ActorRefFrom<typeof modalContentMachine>;
}) => {
  const context = useSelector(actor, (snapshot) => snapshot.context);
  return (
    <div>
      <input
        type="text"
        value={context.message}
        onChange={(e) =>
          actor.send({ type: "update-message", value: e.target.value })
        }
      />
      <button onClick={() => actor.send({ type: "close" })}>Close</button>
      <button onClick={() => actor.send({ type: "send" })}>Confirm</button>
    </div>
  );
};

export default function Page() {
  const [snapshot, send] = useMachine(modalMachine);
  return (
    <div>
      <button onClick={() => send({ type: "open" })}>Open dialog</button>

      {snapshot.context.receivedMessage !== null && (
        <p>Received message: {snapshot.context.receivedMessage}</p>
      )}

      <dialog open={snapshot.matches("Opened")}>
        {snapshot.children.modalContent !== undefined && (
          <ModalContent actor={snapshot.children.modalContent} />
        )}
      </dialog>
    </div>
  );
}
