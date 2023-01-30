import IServiceOperations from "../interfaces/IServiceOperations";
import IUser, { IUserRequest, IUserResponse } from "../interfaces/IUser";

interface IUserService extends IServiceOperations<IUser, IUserResponse> {
  register: (user: IUserRequest) => Promise<IUser>;
}

export default IUserService;
