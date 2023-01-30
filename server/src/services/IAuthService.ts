import IToken from "../interfaces/IToken";
import IUser, { IUserRequest } from "../interfaces/IUser";

type UserWithTokens = ReturnType<IAuthService["createAndSaveToken"]>;

interface IAuthService {
  register: (user: IUserRequest) => UserWithTokens;
  login: (user: IUserRequest) => UserWithTokens;
  refresh: (refreshToken: string) => UserWithTokens;
  logout: (refreshToken: string) => Promise<IToken>;
  createAndSaveToken: (user: IUser) => Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>;
}

export default IAuthService;
