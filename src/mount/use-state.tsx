import { useEffect, useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function UseState() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);

  const submitSearch = async () => {
    if (!searching) {
      setSearching(true);
      const newPosts = await fetch(
        `https://jsonplaceholder.typicode.com/posts?title_like=${query}`
      ).then((response) => response.json());

      setPosts(newPosts);
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" onClick={submitSearch}>
          Search
        </button>
      </div>

      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
