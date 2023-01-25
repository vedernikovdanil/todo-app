import Chance from "chance";
import IUser from "../interfaces/IUser";
import { getRandom } from "../utils";

const chance = new Chance();

class UserTemplate implements IUser {
  static id = 0;
  static logins = chance.unique(() => chance.twitter().substring(1), 100);
  id = crypto.randomUUID();
  name = chance.first();
  lastName = chance.last();
  middleName = chance.name({ middle: true }).split(" ").at(-1)!;
  login = UserTemplate.logins[UserTemplate.id++];
  supervisorId: string | null = null;

  static getSupervisor(users: UserTemplate[]) {
    let hasSubordinate = false;
    let user: UserTemplate;
    do {
      user = getRandom(users);
      hasSubordinate = !!users.find((u) => u.supervisorId === user.id);
    } while (!hasSubordinate);
    return user;
  }
  static getSubordinate(supervisorId: string, users: UserTemplate[]) {
    let hasSupervisor = false;
    let user: UserTemplate;
    do {
      user = getRandom(users);
      hasSupervisor = user.supervisorId === supervisorId;
    } while (!hasSupervisor);
    return user;
  }
}

export default UserTemplate;
