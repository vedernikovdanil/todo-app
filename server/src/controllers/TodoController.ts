import authMiddleware from "../middlewares/authMiddleware";
import TodoService from "../services/TodoService";
import { body } from "express-validator";
import { TodoPriorityEnum, TodoStatusEnum } from "../interfaces/enums/TodoEnum";
import HttpError from "../models/HttpError";
import Controller, { ControllerRoute } from "../models/Controller";
import ITodo from "../interfaces/ITodo";
import ITodoResponse from "../interfaces/response/ITodoResponse";
import UserService from "../services/UserService";
import validationMiddleware from "../middlewares/validationMiddleware";

class TodoController extends Controller<ITodo, ITodoResponse> {
  service = new TodoService();
  userService = new UserService();

  constructor() {
    super();
    this.router.get("/my-todos", authMiddleware, this.getTodosByUser);
    this.router.get("/todos", authMiddleware, this.getTodosToUser);
    this.router.get("/todos/:id", authMiddleware, this.getById);
    this.router.post(
      "/todos",
      authMiddleware,
      this.addTodoMiddleware,
      this.responsibleMiddleware,
      this.validationAddMiddleware,
      this.add
    );
    this.router.patch(
      "/todos/:id",
      authMiddleware,
      this.editTodoMiddleware,
      this.responsibleMiddleware,
      this.validationEditMiddleware,
      this.edit
    );
  }

  validationAddMiddleware = [
    body("title").notEmpty(),
    body("status").isIn(Object.values(TodoStatusEnum)),
    body("priority").isIn(Object.values(TodoPriorityEnum)),
    body(["createdAt", "expiresAt", "updatedAt"]).isDate().optional(),
    body(["creatorId", "responsibleId"]).isUUID().notEmpty(),
    validationMiddleware,
  ];

  validationEditMiddleware = [
    body("status").isIn(Object.values(TodoStatusEnum)).optional(),
    body("priority").isIn(Object.values(TodoPriorityEnum)).optional(),
    body(["createdAt", "expiresAt", "updatedAt"]).isDate().optional(),
    validationMiddleware,
  ];

  private responsibleMiddleware: ControllerRoute = async (req, res, next) => {
    try {
      if (req.body.responsible) {
        const login = req.body.responsible;
        const responsible = await this.userService.searchItem({ login });
        if (!responsible) {
          throw HttpError.NotExist("User", login);
        }
        const isCreator = req.user.id === responsible?.id;
        const isResponsible = req.user.id === responsible?.supervisorId;
        if (!isCreator && !isResponsible) {
          throw HttpError.Forbidden(
            `Responsible '${responsible.login}' is not subordinate`
          );
        }
        req.body.responsibleId = responsible.id;
      }
      delete req.body.responsible;
      next();
    } catch (e) {
      next(e);
    }
  };

  addTodoMiddleware: ControllerRoute = async (req, res, next) => {
    try {
      req.body.creatorId = req.user.id;
      next();
    } catch (e) {
      next(e);
    }
  };

  editTodoMiddleware: ControllerRoute = async (req, res, next) => {
    try {
      const todo = await this.service.getById(+req.params.id);
      const isCreator = req.user.id === todo?.creatorId;
      const onlyStatus =
        Object.entries(req.body).length === 1 && req.body?.status;
      if (!isCreator && !onlyStatus) {
        throw HttpError.Forbidden("You can edit only status");
      }
      next();
    } catch (e) {
      next(e);
    }
  };

  getTodosByUser: ControllerRoute = async (req, res, next) => {
    try {
      if (!req?.user) {
        throw HttpError.Unauthorized();
      }
      const todos = await this.service.searchAll({
        creatorId: req.user.id,
      });
      res.send(todos);
    } catch (e) {
      next(e);
    }
  };

  getTodosToUser: ControllerRoute = async (req, res, next) => {
    try {
      const todos = await this.service.searchAll({
        responsibleId: req.user.id,
      });
      res.send(todos);
    } catch (e) {
      next(e);
    }
  };
}

export default TodoController;
