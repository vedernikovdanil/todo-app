import { body } from "express-validator";
import { NextFunction, Request, Response, Router } from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import DecorateAll from "../utils/decorators/DecorateAll";
import TryCatchMiddleware from "../utils/decorators/TryCatchMiddleware";
import IController from "../interfaces/IController";
import IAuthService from "../services/IAuthService";

@DecorateAll(TryCatchMiddleware)
class AuthController implements IController {
  router = Router();

  constructor(private authService: IAuthService) {
    const router = this.router;
    router.post("/login", this.login.bind(this));
    router.post(
      "/register",
      body(["name", "lastName", "middleName"]).isLength({ min: 2, max: 50 }),
      body(["login", "password"]).isLength({ min: 4, max: 50 }),
      validationMiddleware,
      this.register.bind(this)
    );
    router.post("/logout", this.logout.bind(this));
    router.post("/refresh", this.refresh.bind(this));
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const userData = await this.authService.register(req.body);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send(userData);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const userData = await this.authService.login(req.body);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send(userData);
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.send(token);
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send(userData);
  }
}

export default AuthController;
