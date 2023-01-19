import IUser from "../interfaces/IUser";
import IUserResponse from "../interfaces/response/IUserResponse";
import Controller from "../models/Controller";
import UserService from "../services/UserService";

class UserController extends Controller<IUser, IUserResponse> {
  service = new UserService();
  constructor() {
    super("users");
  }
}

export default UserController;
