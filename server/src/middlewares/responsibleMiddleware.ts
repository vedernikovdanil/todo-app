import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import HttpError from "../utils/HttpError";

async function responsibleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.body.responsible) {
      const login = req.body.responsible;
      const responsible = await new UserService().search({ login });
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
  } catch (e) {
    next(e);
  }
}

export default responsibleMiddleware;
