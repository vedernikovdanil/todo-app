import IUserResponse from "./IUserResponse";

interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
}

export default IAuthResponse;
