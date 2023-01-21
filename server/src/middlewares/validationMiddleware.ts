import { validationResult } from "express-validator";
import { Middleware } from "../models/Controller";
import HttpError from "../models/HttpError";

const validationMiddleware: Middleware = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(HttpError.NotValidated(errors.array()));
  }
  next();
};

export default validationMiddleware;
