import { useState } from "react";
import { initialContext, postRequest, type Context } from "./shared";

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);

  const onUpdateUsername = (value: string) => {
    setContext({ username: value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postRequest(context);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) => onUpdateUsername(e.target.value)}
      />
      <button type="submit">Confirm</button>
    </form>
  );
}
