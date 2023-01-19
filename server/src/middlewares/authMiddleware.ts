import { NextFunction, Request, Response } from "express";
import IUser from "../interfaces/IUser";
import HttpError from "../models/HttpError";
import TokenService from "../services/TokenService";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw HttpError.Unauthorized();
    }
    const accessToken = authorizationHeader.split(" ")?.at(1);
    if (!accessToken) {
      throw HttpError.Unauthorized();
    }
    const userData = new TokenService().validateAccessToken(accessToken);
    if (!userData) {
      throw HttpError.Unauthorized();
    }
    req.user = userData as IUser;
    next();
  } catch (e) {
    next(e);
  }
}

export default authMiddleware;
