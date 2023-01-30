import _ from "lodash";
import knex from "../persistence";
import IUser, { IUserRequest, IUserResponse } from "../interfaces/IUser";
import KnexOperations from "../utils/KnexOperations";
import IUserPassword from "../interfaces/IUserPassword";
import IServiceOperations from "../interfaces/IServiceOperations";
import IUserService from "./IUserService";

class UserService
  extends KnexOperations<IUser, IUserResponse>
  implements IUserService
{
  constructor() {
    const query = () =>
      knex("users as u")
        .select<IUserResponse[]>("u.*", "u1.login as supervisor")
        .leftJoin("users as u1", "u1.id", "u.supervisorId");
    super(query, "u");
  }

  async register(item: IUserRequest) {
    return await knex.transaction(async (trx) => {
      const { password, supervisor, ...user } = { ...item };
      const [createdUser] = await trx<IUser>("users")
        .insert(user)
        .returning("*");
      const authUser: IUserPassword = {
        userId: createdUser.id,
        password,
      };
      await trx<IUserPassword>("users-passwords").insert(authUser);
      return createdUser;
    });
  }
}

export default UserService;
