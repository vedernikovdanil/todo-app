import _ from "lodash";
import IUserResponse from "../interfaces/response/IUserResponse";
import IUserRequest from "../interfaces/request/IUserRequest";
import knex from "../persistence";
import IUser from "../interfaces/IUser";
import Service from "../models/Service";
import IAuthUser from "../interfaces/IAuthUser";

class UserService extends Service<IUser, IUserResponse> {
  query = () => knex<IUserResponse>("users");

  override async add(item: IUserRequest): Promise<IUser> {
    return await knex.transaction(async (trx) => {
      const { password, supervisor, ...user } = { ...item };
      const [createdUser] = await trx<IUser>("users")
        .insert(user)
        .returning("*");
      const authUser: IAuthUser = {
        userId: createdUser.id,
        password,
      };
      await trx<IAuthUser>("users-passwords").insert(authUser);
      return createdUser;
    });
  }
}

export default UserService;
