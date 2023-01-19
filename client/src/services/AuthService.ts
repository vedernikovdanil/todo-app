import $axios from "../http";
import ILoginRequest from "../interfaces/request/ILoginRequest";
import IRegisterRequest from "../interfaces/request/IRegisterRequest";
import IAuthResponse from "../interfaces/response/IAuthResponse";

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
