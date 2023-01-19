import { Request, Response, NextFunction, Router } from "express";
import Service from "./Service";

export type ControllerRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
export interface IController {
  router: Router;
}

abstract class Controller<TSource extends {}, TResponse>
  implements IController
{
  public router = Router();
  abstract service: Service<TSource, TResponse>;

  constructor(routeName?: string) {
    if (routeName) {
      this.router.get(`/${routeName}`, this.getAll);
      this.router.get(`/${routeName}/search`, this.searchAll);
      this.router.get(`/${routeName}/pagination`, this.pagination);
      this.router.get(`/${routeName}/:id`, this.getById);
    }
  }

  getAll: ControllerRoute = async (req, res, next) => {
    try {
      const users = await this.service.getAll();
      res.send(users || []);
    } catch (e) {
      next(e);
    }
  };

  getById: ControllerRoute = async (req, res, next) => {
    try {
      const user = await this.service.getById(req.params.id);
      res.send(user || null);
    } catch (e) {
      next(e);
    }
  };

  add: ControllerRoute = async (req, res, next) => {
    try {
      const todo = await this.service.add(req.body);
      res.send(todo);
    } catch (e) {
      next(e);
    }
  };

  edit: ControllerRoute = async (req, res, next) => {
    try {
      const todo = await this.service.edit(+req.params.id, req.body);
      res.send(todo);
    } catch (e) {
      next(e);
    }
  };

  remove: ControllerRoute = async (req, res, next) => {
    try {
      const todo = await this.service.remove(+req.params.id);
      res.send(todo);
    } catch (e) {
      next(e);
    }
  };

  searchAll: ControllerRoute = async (req, res, next) => {
    try {
      const query = new Object(req.query);
      const users = await this.service.searchAll(query as any);
      res.send(users || []);
    } catch (e) {
      next(e);
    }
  };

  pagination: ControllerRoute = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, orderBy, desc } = req.query;
      const order = orderBy && `${orderBy}`;
      const data = await this.service.pagination(+page, +limit, order, !!desc);
      res.send(data);
    } catch (e) {
      next(e);
    }
  };
}

export default Controller;
