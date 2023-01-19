import $axios from "../http";
import IUser from "../interfaces/IUser";
import IUserResponse from "../interfaces/response/IUserResponse";

class UserService {
  async fetchUsers() {
    return await $axios.get<IUserResponse[]>("/users");
  }

  async fetchUser(id: string) {
    return await $axios.get<IUserResponse>(`/users/${id}`);
  }

  async searchUsers(user: Partial<IUser>) {
    const searchParams = new URLSearchParams();
    Object.entries(user).forEach(([key, value]) => {
      searchParams.set(key, value || "");
    });
    const query = searchParams.toString();
    return await $axios.get<IUserResponse[]>(`/users/search?${query}`);
  }

  async getSubordinates(id: string) {
    return await this.searchUsers({ supervisorId: id });
  }
}

export default UserService;
