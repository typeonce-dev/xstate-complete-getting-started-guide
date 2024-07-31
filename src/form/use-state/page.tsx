import { useState } from "react";

interface Context {
  username: string;
  age: number;
}

export const initialState: Context = { username: "", age: 26 };

export default function Page() {
  const [context, setContext] = useState<Context>(initialState);

  const onUpdateUsername = (value: string) => {
    setContext({ ...context, username: value });
  };

  const onUpdateAge = (value: number) => {
    setContext({ ...context, age: value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await new Promise<boolean>((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 1000)
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={context.username}
        onChange={(e) => onUpdateUsername(e.target.value)}
      />
      <input
        type="number"
        value={context.age}
        onChange={(e) => onUpdateAge(e.target.valueAsNumber)}
      />
      <button type="submit">Confirm</button>
    </form>
  );
}
