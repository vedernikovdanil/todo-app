import App from "./App";
import { PORT } from "./configs/app.config";
import AuthController from "./controllers/AuthController";
import UserController from "./controllers/UserController";
import TodoController from "./controllers/TodoController";
import AuthService from "./services/AuthService";
import UserService from "./services/UserService";
import TokenService from "./services/TokenService";

const authService = new AuthService(new UserService(), new TokenService());

const app = new App(
  [new AuthController(authService), new UserController(), new TodoController()],
  PORT
);

app.listen();
