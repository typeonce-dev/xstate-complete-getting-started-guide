import { useEffect, useReducer, useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Event =
  | { type: "update-query"; value: string }
  | { type: "update-posts"; newPosts: Post[] };

type Context = { query: string; posts: Post[] };
const initialContext = { query: "", posts: [] };

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
  const [searching, setSearching] = useState(false);

  const submitSearch = async () => {
    if (!searching) {
      setSearching(true);
      const newPosts = await fetch(
        `https://jsonplaceholder.typicode.com/posts?title_like=${context.query}`
      ).then((response) => response.json());

      send({ type: "update-posts", newPosts });
      setSearching(false);
    }
  };

  useEffect(() => {
    submitSearch();
  }, []);

  if (searching) {
    return <p>Searching...</p>;
  }

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
