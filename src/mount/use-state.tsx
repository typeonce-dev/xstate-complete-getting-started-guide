import { useEffect, useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Context = { query: string; posts: Post[] };
const initialContext = { query: "", posts: [] };

export default function UseState() {
  const [context, setContext] = useState<Context>(initialContext);
  const [searching, setSearching] = useState(false);

  const submitSearch = async () => {
    if (!searching) {
      setSearching(true);
      const newPosts = await fetch(
        `https://jsonplaceholder.typicode.com/posts?title_like=${context.query}`
      ).then((response) => response.json());

      setContext({ ...context, posts: newPosts });
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
