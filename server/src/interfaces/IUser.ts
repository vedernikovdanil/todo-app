interface IUser {
  id: string;
  name: string;
  lastName: string;
  middleName: string;
  login: string;
  supervisorId: string | null;
}

export interface IUserResponse extends IUser {
  supervisor?: string;
}

export interface IUserRequest extends Omit<IUser, "id" | "supervisorId"> {
  password: string;
  supervisor?: string | null;
}

export default IUser;
