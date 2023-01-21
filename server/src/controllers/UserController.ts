import IUser, { IUserResponse } from "../interfaces/IUser";
import Controller from "../models/Controller";
import UserService from "../services/UserService";

class UserController extends Controller<IUser, IUserResponse> {
  service = new UserService();
  constructor() {
    super("users");
    this.initRoutes();
  }
}

export default UserController;
