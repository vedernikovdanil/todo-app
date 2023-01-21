import _ from "lodash";
import knex from "../persistence";
import IUser, { IUserRequest, IUserResponse } from "../interfaces/IUser";
import Service from "../models/Service";
import IAuthUser from "../interfaces/IAuthUser";

class UserService extends Service<IUser, IUserResponse> {
  query = () =>
    knex("users as u")
      .select<IUserResponse[]>("u.*", "u1.login as supervisor")
      .leftJoin("users as u1", "u1.id", "u.supervisorId");
  alias = "u";

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
