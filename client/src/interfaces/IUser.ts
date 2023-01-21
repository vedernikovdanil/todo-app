interface IUser {
  id: string;
  name: string;
  lastName: string;
  middleName: string;
  login: string;
  supervisorId: string | null;
}

export interface IUserRequest extends Omit<IUser, "id" | "supervisorId"> {
  password: string;
  supervisor?: string | null;
}

export interface IUserResponse extends IUser {
  supervisor?: string;
}

export default IUser;
