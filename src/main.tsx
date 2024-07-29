import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MoveSearchPage from "./movie-search/page";
import NotificationsMachinePage from "./notifications/machine/page";
import NotificationsUseStatePage from "./notifications/use-state/page";
import TicTacToePage from "./tic-tac-toe/page";
import TimerMachinePage from "./timer/machine/page";
import TimerUseStatePage from "./timer/use-state/page";

const router = createBrowserRouter([
  {
    path: "/timer/use-state",
    element: <TimerUseStatePage />,
  },
  {
    path: "/timer/machine",
    element: <TimerMachinePage />,
  },
  {
    path: "/movie-search",
    element: <MoveSearchPage />,
  },
  {
    path: "/tic-tac-toe",
    element: <TicTacToePage />,
  },
  {
    path: "/notifications/use-state",
    element: <NotificationsUseStatePage />,
  },
  {
    path: "/notifications/machine",
    element: <NotificationsMachinePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
