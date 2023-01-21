import $axios from "../http";
import { IUserResponse } from "../interfaces/IUser";
import { ILoginRequest } from "../models/validation/LoginValidation";
import { IRegisterRequest } from "../models/validation/RegisterValidation";

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
