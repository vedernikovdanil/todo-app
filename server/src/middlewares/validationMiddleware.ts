import { validationResult } from "express-validator";
import HttpError from "../utils/HttpError";

const validationMiddleware: Middleware = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(HttpError.NotValidated(errors.array()));
  }
  next();
};

export default validationMiddleware;
