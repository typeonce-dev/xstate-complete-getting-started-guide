export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Context = { query: string; posts: Post[] };
export const initialContext = { query: "", posts: [] };

export const searchRequest = async (query: string): Promise<Post[]> =>
  fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${query}`).then(
    (response) => response.json()
  );
