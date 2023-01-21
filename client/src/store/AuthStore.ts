import { makeAutoObservable } from "mobx";
import { IUserResponse } from "../interfaces/IUser";
import { ILoginRequest } from "../models/validation/LoginValidation";
import AuthService from "../services/AuthService";

const authService = new AuthService();

class AuthStore {
  user: IUserResponse | null = null;
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth(value: boolean) {
    this.isAuth = value;
  }

  setUser(user: IUserResponse | null) {
    this.user = user;
  }

  async login(request: ILoginRequest) {
    const response = await authService.login(request);
    if (response?.status === 200) {
      localStorage.setItem("token", response.data.accessToken);
      this.setIsAuth(true);
      this.setUser(response.data.user);
    }
  }

  async logout() {
    await authService.logout();
    localStorage.removeItem("token");
    this.setIsAuth(false);
    this.setUser(null);
  }

  async checkAuth() {
    try {
      const response = await authService.refresh();
      if (response?.status === 200) {
        localStorage.setItem("token", response.data.accessToken);
        this.setIsAuth(true);
        this.setUser(response.data.user);
      }
    } catch (e) {}
  }
}

export default AuthStore;
