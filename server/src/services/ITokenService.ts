import IToken from "../interfaces/IToken";
import IUser from "../interfaces/IUser";

interface ITokenService {
  getAllTokens: () => Promise<IToken[]>;
  getToken: (refreshToken: string) => Promise<IToken | undefined>;
  saveToken: (userId: string, refreshToken: string) => Promise<IToken>;
  removeToken: (refreshToken: string) => Promise<IToken>;
  validateAccessToken: (token: string) => IUser | null;
  validateRefreshToken: (token: string) => IUser | null;
  generateToken: (payload: any) => {
    accessToken: string;
    refreshToken: string;
  };
}

export default ITokenService;
