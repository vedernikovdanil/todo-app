import _ from "lodash";
import TodoService from "../services/TodoService";
import { body, param } from "express-validator";
import HttpError from "../models/HttpError";
import UserService from "../services/UserService";
import validationMiddleware from "../middlewares/validationMiddleware";
import { NextFunction, Request, Response } from "express";
import Controller, { Middleware } from "../models/Controller";
import ITodo, {
  TodoPriorityEnum,
  TodoStatusEnum,
  ITodoResponse,
} from "../interfaces/ITodo";
import DecorateAll from "../decorators/DecorateAll";
import TryCatchMiddleware from "../decorators/TryCatchMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

@DecorateAll(TryCatchMiddleware)
class TodoController extends Controller<ITodo, ITodoResponse> {
  service = new TodoService();
  userService = new UserService();

  constructor() {
    super("todos", authMiddleware);
    const routes = this.getRoutes();
    routes.get(`post/${this.route}`)!.unshift(this.addMiddlewares);
    routes.get(`patch/${this.route}/:id`)!.unshift(this.editMiddlewares);
    this.router.get(`/${this.route}/my`, this.getAllOfUser.bind(this));
    this.initRoutes(routes);
  }

  addMiddlewares: Middleware[] = [
    this.responsibleMiddleware.bind(this),
    this.creatorMiddleware.bind(this),
    body("title").notEmpty(),
    body("status").isIn(Object.values(TodoStatusEnum)),
    body("priority").isIn(Object.values(TodoPriorityEnum)),
    body(["createdAt", "expiresAt", "updatedAt"]).isDate().optional(),
    body(["creatorId", "responsibleId"]).notEmpty(),
    validationMiddleware,
  ];

  editMiddlewares: Middleware[] = [
    this.responsibleMiddleware.bind(this),
    body("status").isIn(Object.values(TodoStatusEnum)).optional(),
    body("priority").isIn(Object.values(TodoPriorityEnum)).optional(),
    body(["createdAt", "expiresAt", "updatedAt"]).isDate().optional(),
    validationMiddleware,
  ];

  private async responsibleMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body.responsible) {
      const login = req.body.responsible;
      const responsible = await this.userService.searchItem({ login });
      if (!responsible) {
        throw HttpError.NotExist("User", login);
      }
      const isCreator = req.user.id === responsible?.id;
      const isResponsible = req.user.id === responsible?.supervisorId;
      if (!isCreator && !isResponsible) {
        throw HttpError.Forbidden(`'${responsible.login}' not subordinate`);
      }
      req.body.responsibleId = responsible.id;
    }
    delete req.body.responsible;
    next();
  }

  private creatorMiddleware(req: Request, res: Response, next: NextFunction) {
    req.body.creatorId = req.user.id;
    next();
  }

  override async getAll(req: Request, res: Response, next: NextFunction) {
    const responsibleId = req.user.id;
    const todos = await this.service.searchAll({ responsibleId });
    res.send(todos);
  }

  async getAllOfUser(req: Request, res: Response, next: NextFunction) {
    if (!req?.user) {
      throw HttpError.Unauthorized();
    }
    const creatorId = req.user.id;
    const todos = await this.service.searchAll({ creatorId });
    res.send(todos);
  }

  override async editById(req: Request, res: Response, next: NextFunction) {
    const todo = await this.service.getById(+req.params.id);
    const isCreator = req.user.id === todo?.creatorId;
    const onlyStatus = _.isEqual(Object.keys(req.body), ["status"]);
    if (!isCreator && !onlyStatus) {
      throw HttpError.Forbidden("You can edit only status");
    }
    this.service.edit(req.params.id, req.body);
    super.editById(req, res, next);
  }
}

export default TodoController;
