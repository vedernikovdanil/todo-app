import IUser from "../IUser";

interface IUserResponse extends IUser {
  supervisor?: string;
}

export default IUserResponse;
