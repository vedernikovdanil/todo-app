import { Request, Response, NextFunction, Router } from "express";
import _ from "lodash";
import DecorateAll from "./decorators/DecorateAll";
import TryCatchMiddleware from "./decorators/TryCatchMiddleware";
import IController from "../interfaces/IController";
import IControllerOperations from "../interfaces/IControllerOperations";

@DecorateAll(TryCatchMiddleware)
class ControllerOperations<
  TSource extends { id: string | number },
  TResponse extends {}
> implements IController, IControllerOperations<TSource, TResponse>
{
  public router = Router();

  constructor(protected api: IServiceOperations<TSource, TResponse>) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    const data = await this.api.getAll();
    res.send(data || []);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const item = await this.api.getById(req.params.id);
    res.send(item || null);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const item = await this.api.create(req.body);
    res.send(item);
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    const item = await this.api.edit(+req.params.id, req.body);
    res.send(item);
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const item = await this.api.remove(+req.params.id);
    res.send(item);
  }

  async search(req: Request, res: Response, next: NextFunction) {
    const query = new Object(req.query);
    const item = await this.api.search(query as any);
    res.send(item || []);
  }

  async searchAll(req: Request, res: Response, next: NextFunction) {
    const query = new Object(req.query);
    const data = await this.api.searchAll(query as any);
    res.send(data || []);
  }

  async pagination(req: Request, res: Response, next: NextFunction) {
    const { page = 1, limit = 10, orderBy, desc } = req.query;
    const _orderBy = (orderBy && `${orderBy}`) as keyof TSource;
    const data = await this.api.pagination(+page, +limit, _orderBy, !!desc);
    res.send(data);
  }
}

export default ControllerOperations;
