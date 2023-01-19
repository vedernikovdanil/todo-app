import AuthService from "../services/AuthService";
import { body } from "express-validator";
import { ControllerRoute, IController } from "../models/Controller";
import { Router } from "express";
import validationMiddleware from "../middlewares/validationMiddleware";

class AuthController implements IController {
  authService = new AuthService();
  router = Router();

  constructor() {
    this.router.post("/login", this.login);
    this.router.post(
      "/register",
      body(["name", "lastName", "middleName"]).isLength({ min: 2, max: 50 }),
      body(["login", "password"]).isLength({ min: 4, max: 50 }),
      validationMiddleware,
      this.register
    );
    this.router.post("/logout", this.logout);
    this.router.post("/refresh", this.refresh);
  }

  register: ControllerRoute = async (req, res, next) => {
    try {
      const userData = await this.authService.register(req.body);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send(userData);
    } catch (e) {
      next(e);
    }
  };

  login: ControllerRoute = async (req, res, next) => {
    try {
      const userData = await this.authService.login(req.body);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send(userData);
    } catch (e) {
      next(e);
    }
  };

  logout: ControllerRoute = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const token = await this.authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.send(token);
    } catch (e) {
      next(e);
    }
  };

  refresh: ControllerRoute = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const userData = await this.authService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send(userData);
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
