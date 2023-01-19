import App from "./App";
import AuthController from "./controllers/AuthController";
import { PORT } from "./configuration";
import UserController from "./controllers/UserController";
import TodoController from "./controllers/TodoController";

const app = new App(
  [new AuthController(), new UserController(), new TodoController()],
  PORT
);

app.listen();
