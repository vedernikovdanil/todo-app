import { Request, Response, NextFunction, Router } from "express";
import _ from "lodash";
import DecorateAll from "../decorators/DecorateAll";
import TryCatchMiddleware from "../decorators/TryCatchMiddleware";
import Service from "./Service";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface IController {
  router: Router;
}

export type RouteMethods = "get" | "post" | "put" | "patch" | "delete";

@DecorateAll(TryCatchMiddleware)
abstract class Controller<TSource extends {}, TResponse>
  implements IController
{
  public router = Router();
  public route: string;
  abstract service: Service<TSource, TResponse>;

  constructor(route: string, middleware?: Middleware) {
    this.route = route;
    middleware && this.router.use(`/${route}`, middleware);
  }

  protected getRoutes: () => Map<string, (Middleware | Middleware[])[]> = () =>
    new Map([
      [`get/${this.route}`, [this.getAll.bind(this)]],
      [`post/${this.route}`, [this.add.bind(this)]],
      [`patch/${this.route}/:id`, [this.editById.bind(this)]],
      [`delete/${this.route}/:id`, [this.removeById.bind(this)]],
      [`get/${this.route}/search`, [this.searchAll.bind(this)]],
      [`get/${this.route}/pagination`, [this.pagination.bind(this)]],
      [`get/${this.route}/:id`, [this.getById.bind(this)]],
    ]);

  protected initRoutes(routes?: ReturnType<typeof this.getRoutes>) {
    routes = routes || this.getRoutes();
    for (const [route, middlewares] of routes) {
      const [method, ...paths] = route.split("/");
      const path = "/" + paths.join("/");
      this.router[method as RouteMethods](path, ...middlewares);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await this.service.getAll();
    res.send(users || []);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const user = await this.service.getById(req.params.id);
    res.send(user || null);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    const todo = await this.service.add(req.body);
    res.send(todo);
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    const todo = await this.service.edit(+req.params.id, req.body);
    res.send(todo);
  }

  async removeById(req: Request, res: Response, next: NextFunction) {
    const todo = await this.service.remove(+req.params.id);
    res.send(todo);
  }

  async searchAll(req: Request, res: Response, next: NextFunction) {
    const query = new Object(req.query);
    const users = await this.service.searchAll(query as any);
    res.send(users || []);
  }

  async pagination(req: Request, res: Response, next: NextFunction) {
    const { page = 1, limit = 10, orderBy, desc } = req.query;
    const order = orderBy && `${orderBy}`;
    const data = await this.service.pagination(+page, +limit, order, !!desc);
    res.send(data);
  }
}

export default Controller;
