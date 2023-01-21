import knex from "../persistence";
import bcrypt from "bcryptjs";
import TokenService from "./TokenService";
import HttpError from "../models/HttpError";
import UserService from "./UserService";
import IUser, { IUserRequest } from "../interfaces/IUser";
import IAuthUser from "../interfaces/IAuthUser";

class AuthService {
  userService = new UserService();
  tokenService = new TokenService();

  async register(user: IUserRequest) {
    user.login = user.login.trim();
    const existed = await this.userService.searchItem({ login: user.login });
    if (existed) {
      throw HttpError.BadRequest(`User ${user.login} already has registered`);
    }
    let supervisorId = null;
    if (user.supervisor) {
      const supervisor = await this.userService.searchItem({
        login: user.supervisor,
      });
      if (!supervisor) {
        throw HttpError.NotExist("Supervisor", user.supervisor);
      }
      supervisorId = supervisor.id;
    }
    delete user.supervisor;
    const password = await bcrypt.hash(user.password, 5);
    const userToAdd = { ...user, supervisorId, password };
    const createdUser = await this.userService.add(userToAdd);
    return await this.createAndSaveToken(createdUser);
  }

  async login({ login, password }: IUserRequest) {
    const user = await this.userService.searchItem({ login });
    const auth = user ? await this.getPassword(user.id) : null;
    const isCorrectPassword = auth
      ? await bcrypt.compare(password, auth.password)
      : null;
    if (!user || !auth || !isCorrectPassword) {
      throw HttpError.BadRequest("Incorrect login or password");
    }
    return await this.createAndSaveToken(user!);
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw HttpError.Unauthorized();
    }
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const token = await this.tokenService.getToken(refreshToken);
    if (!userData || !token) {
      throw HttpError.Unauthorized();
    }
    const user = await this.userService.getById(userData.id);
    return await this.createAndSaveToken(user!);
  }

  async createAndSaveToken(user: IUser) {
    const tokens = this.tokenService.generateToken({ ...user });
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return { ...tokens, user };
  }

  private async getPassword(id: string) {
    const userAuth = await knex<IAuthUser>("users-passwords")
      .where({ userId: id })
      .first();
    return userAuth;
  }
}

export default AuthService;
