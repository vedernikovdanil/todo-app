import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { setupInterceptors } from "./http";
import AuthStore from "./store/AuthStore";
import ErrorStore from "./store/ErrorStore";
import App, { loader as appLoader } from "./App";
import Home from "./pages/Home";
import Logout, { action as logoutAction } from "./pages/auth/Logout";
import Register, {
  loader as registerLoader,
  action as registerAction,
} from "./pages/auth/Register";
import Login, {
  loader as loginLoader,
  action as loginAction,
} from "./pages/auth/Login";
import TodosPage, {
  loader as todosLoader,
  action as todoAction,
} from "./pages/TodosPage";
import UsersPage, { loader as usersLoader } from "./pages/UsersPage";
import ModalStore from "./store/Modal.Store";

const globalStore = {
  auth: new AuthStore(),
  error: new ErrorStore(),
  modal: new ModalStore(),
};

export type StoreContextType = typeof globalStore;
export const StoreContext = React.createContext(globalStore);

setupInterceptors(globalStore);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: appLoader(globalStore),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
        loader: registerLoader(globalStore),
        action: registerAction(globalStore),
      },
      {
        path: "login",
        element: <Login />,
        loader: loginLoader(globalStore),
        action: loginAction(globalStore),
      },
      {
        path: "logout",
        element: <Logout />,
        action: logoutAction(globalStore),
      },
      {
        path: "users",
        element: <UsersPage />,
        loader: usersLoader(globalStore),
      },
      {
        path: "todos",
        element: <TodosPage />,
        loader: todosLoader(globalStore),
        action: todoAction(globalStore),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreContext.Provider value={globalStore}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </React.StrictMode>
);
