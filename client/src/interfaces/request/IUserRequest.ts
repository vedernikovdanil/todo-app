import IUser from "../IUser";

interface IUserRequest extends Omit<IUser, "id" | "supervisorId"> {
  password: string;
  supervisor?: string | null;
}

export default IUserRequest;
