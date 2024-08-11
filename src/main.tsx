import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FormMachinePage from "./form/machine/page";
import FormReducerPage from "./form/reducer/page";
import FormUseStatePage from "./form/use-state/page";
import ModalPage from "./modal/page";
import MoveSearchPage from "./movie-search/page";
import NotificationsMachinePage from "./notifications/machine/page";
import NotificationsUseStatePage from "./notifications/use-state/page";
import NpcPage from "./npc/page";
import TicTacToePage from "./tic-tac-toe/page";
import TimerMachinePage from "./timer/machine/page";
import TimerUseStatePage from "./timer/use-state/page";
import ToggleMachinePage from "./toggle/machine/page";
import ToggleUseStatePage from "./toggle/use-state/page";

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
  {
    path: "/modal",
    element: <ModalPage />,
  },
  {
    path: "/npc",
    element: <NpcPage />,
  },
  {
    path: "/form/use-state",
    element: <FormUseStatePage />,
  },
  {
    path: "/form/reducer",
    element: <FormReducerPage />,
  },
  {
    path: "/form/machine",
    element: <FormMachinePage />,
  },
  {
    path: "/toggle/machine",
    element: <ToggleMachinePage />,
  },
  {
    path: "/toggle/use-state",
    element: <ToggleUseStatePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
