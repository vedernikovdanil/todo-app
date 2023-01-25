import { ErrorRequestHandler } from "express";
import HttpError from "../utils/HttpError";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (!(err instanceof HttpError)) {
    if (err instanceof Error) {
      console.error(err);
      err = new HttpError(500, err.message);
    } else {
      err = new HttpError(520, "Unhandled error");
    }
  }
  if (err instanceof HttpError) {
    return res.status(err.status).send(err);
  }
};

export default errorMiddleware;
