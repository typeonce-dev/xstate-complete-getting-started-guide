import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MoveSearchPage from "./movie-search/page";
import TicTacToePage from "./tic-tac-toe/page";
import UseStatePage from "./use-state/page";

const router = createBrowserRouter([
  {
    path: "/use-state",
    element: <UseStatePage />,
  },
  {
    path: "/movie-search",
    element: <MoveSearchPage />,
  },
  {
    path: "/tic-tac-toe",
    element: <TicTacToePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
