import { useState } from "react";
import { initialContext, postRequest, type Context } from "./shared";

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);
  const [loading, setLoading] = useState(false);

  const onUpdateUsername = (value: string) => {
    setContext({ username: value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) {
      setLoading(true);
      await postRequest(context);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) => onUpdateUsername(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Confirm
      </button>
    </form>
  );
}
