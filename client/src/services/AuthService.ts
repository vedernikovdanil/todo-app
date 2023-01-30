import $axios from "../http";
import ILoginRequest from "../interfaces/ILoginRequest";
import IRegisterRequest from "../interfaces/IRegisterRequest";
import { IUserResponse } from "../interfaces/IUser";

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
}

class AuthService {
  async login(user: ILoginRequest) {
    return await $axios.post<IAuthResponse>("/login", user);
  }

  async register(user: IRegisterRequest) {
    return await $axios.post<IAuthResponse>("/register", user);
  }

  async logout() {
    await $axios.post("/logout");
  }

  async refresh() {
    return await $axios.post<IAuthResponse>("/refresh");
  }
}

export default AuthService;
