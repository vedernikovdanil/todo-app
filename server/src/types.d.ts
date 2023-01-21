import { NextFunction, Request, Response } from "express";
import IUser from "./interfaces/IUser";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
  type GMethodDecorator<T extends Function> = (
    target: Function,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => TypedPropertyDescriptor<T> | void;
}

export {};
