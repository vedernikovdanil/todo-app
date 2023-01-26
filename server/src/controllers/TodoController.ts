import _ from "lodash";
import TodoService from "../services/TodoService";
import { body } from "express-validator";
import HttpError from "../utils/HttpError";
import validationMiddleware from "../middlewares/validationMiddleware";
import { NextFunction, Request, Response, Router } from "express";
import ControllerOperations from "../utils/ControllerOperations";
import ITodo, {
  TodoPriorityEnum,
  TodoStatusEnum,
  ITodoResponse,
} from "../interfaces/ITodo";
import DecorateAll from "../utils/decorators/DecorateAll";
import TryCatchMiddleware from "../utils/decorators/TryCatchMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import responsibleMiddleware from "../middlewares/responsibleMiddleware";

@DecorateAll(TryCatchMiddleware)
class TodoController extends ControllerOperations<ITodo, ITodoResponse> {
  router = Router();

  constructor() {
    super(new TodoService());
    const router = this.router;
    //USE
    router.use("/todos", authMiddleware);
    //GET
    router.get("/todos", this.getAll.bind(this));
    router.get("/todos/my", this.getAllOfUser.bind(this));
    router.get("/todos/search", this.searchAll.bind(this));
    router.get("/todos/pagination", this.pagination.bind(this));
    router.get("/todos/:id", this.getById.bind(this));
    //POST PATCH DELETE
    router.post("/todos", this.createMiddlewares, this.create.bind(this));
    router.patch("/todos/:id", this.editMiddlewares, this.edit.bind(this));
    router.delete("/todos/:id", this.remove.bind(this));
  }

  private static validationMiddlewares = [
    body("title").notEmpty(),
    body("status").isIn(Object.values(TodoStatusEnum)),
    body("priority").isIn(Object.values(TodoPriorityEnum)),
    body("expiresAt").isDate(),
    body(["creatorId", "responsibleId"]).notEmpty(),
  ];

  private createMiddlewares: Middleware[] = [
    responsibleMiddleware,
    this.creatorMiddleware.bind(this),
    ...TodoController.validationMiddlewares,
    validationMiddleware,
  ];

  private editMiddlewares: Middleware[] = [
    responsibleMiddleware,
    ...TodoController.validationMiddlewares.map((body) => body.optional()),
    validationMiddleware,
  ];

  private creatorMiddleware(req: Request, res: Response, next: NextFunction) {
    req.body.creatorId = req.user.id;
    next();
  }

  async getAllOfUser(req: Request, res: Response, next: NextFunction) {
    const creatorId = req.user.id;
    const todos = await this.api.searchAll({ creatorId });
    res.send(todos);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const responsibleId = req.user.id;
    const todos = await this.api.searchAll({ responsibleId });
    res.send(todos);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const todo = await this.api.getById(+req.params.id);
    const isCreator = req.user.id === todo?.creatorId;
    const onlyStatus = _.isEqual(Object.keys(req.body), ["status"]);
    if (!isCreator && !onlyStatus) {
      throw HttpError.Forbidden("You can edit only status");
    }
    const edittedTodo = await this.api.edit(+req.params.id, req.body);
    res.send(edittedTodo);
  }
}

export default TodoController;
