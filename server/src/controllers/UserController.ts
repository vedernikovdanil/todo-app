import IUser, { IUserResponse } from "./../interfaces/IUser";
import ControllerOperations from "../utils/ControllerOperations";
import UserService from "../services/UserService";
import IController from "../interfaces/IController";
import { Router } from "express";

class UserController
  extends ControllerOperations<IUser, IUserResponse>
  implements IController
{
  router = Router();

  constructor() {
    super(new UserService());
    const router = this.router;
    //GET
    router.get("/users", this.getAll.bind(this));
    router.get("/users/search", this.searchAll.bind(this));
    router.get("/users/pagination", this.pagination.bind(this));
    router.get("/users/:id", this.getById.bind(this));
  }
}

export default UserController;
