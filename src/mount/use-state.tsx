import { useEffect, useState } from "react";
import { initialContext, searchRequest, type Context } from "./shared";

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);

  const submitSearch = async () => {
    const newPosts = await searchRequest(context.query);
    setContext({ ...context, posts: newPosts });
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
          onChange={(e) => setContext({ ...context, query: e.target.value })}
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
