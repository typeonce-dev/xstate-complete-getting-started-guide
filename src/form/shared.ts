export interface Context {
  username: string;
}
export const initialContext: Context = { username: "" };

export const postRequest = (context: Context) =>
  new Promise<Context>((resolve) =>
    setTimeout(() => {
      resolve(context);
    }, 1000)
  );
