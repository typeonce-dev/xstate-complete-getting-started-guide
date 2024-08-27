import { useEffect, useReducer } from "react";
import {
  initialContext,
  searchRequest,
  type Context,
  type Post,
} from "./shared";

type Event =
  | { type: "update-query"; value: string }
  | { type: "update-posts"; newPosts: Post[] };

const reducer = (context: Context, event: Event): Context => {
  if (event.type === "update-query") {
    return { ...context, query: event.value };
  } else if (event.type === "update-posts") {
    return { ...context, posts: event.newPosts };
  }

  return context;
};

export default function UseReducer() {
  const [context, send] = useReducer(reducer, initialContext);

  const submitSearch = async () => {
    const newPosts = await searchRequest(context.query);
    send({ type: "update-posts", newPosts });
  };

  useEffect(() => {
    submitSearch();
  }, []);

  return (
    <div>
      <div>
        <input
          type="search"
          value={context.query}
          onChange={(e) =>
            send({ type: "update-query", value: e.target.value })
          }
        />
        <button type="button" onClick={submitSearch}>
          Search
        </button>
      </div>

      {context.posts.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
