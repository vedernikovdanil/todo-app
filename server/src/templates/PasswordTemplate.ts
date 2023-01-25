import _ from "lodash";
import bcrypt from "bcryptjs";
import UserTemplate from "./UserTemplate";

class PasswordTemplate {
  static _id = 0;
  userId: string;
  password: string;

  constructor(users: UserTemplate[], passwords: string[]) {
    this.userId = users[PasswordTemplate._id].id;
    this.password = passwords[PasswordTemplate._id];
    PasswordTemplate._id++;
  }

  static async createPasswords(count: number) {
    const array = [];
    for (let i = 0; i < count; ++i) {
      const password = await bcrypt.hash(crypto.randomUUID(), 5);
      array.push(password);
    }
    return array;
  }
}

export default PasswordTemplate;
