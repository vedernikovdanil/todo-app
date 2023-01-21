import App from "./App";
import AuthController from "./controllers/AuthController";
import UserController from "./controllers/UserController";
import TodoController from "./controllers/TodoController";
import { PORT } from "./configs/app.config";

const app = new App(
  [new AuthController(), new UserController(), new TodoController()],
  PORT
);

app.listen();
