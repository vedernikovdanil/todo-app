import IUser from "../interfaces/IUser";
import HttpError from "../utils/HttpError";
import TokenService from "../services/TokenService";

const authMiddleware: Middleware = async function (req, res, next) {
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
};

export default authMiddleware;
