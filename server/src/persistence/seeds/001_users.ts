import { Knex } from "knex";
import Chance from "chance";
import bcrypt from "bcryptjs";
import {
  TodoPriorityEnum,
  TodoStatusEnum,
} from "../../interfaces/enums/TodoEnum";
import _ from "lodash";
import ITodoRequest from "../../interfaces/request/ITodoRequest";

const chance = new Chance();

function toSQLDate(date: Date) {
  const now = new Date();
  date.setFullYear(now.getFullYear());
  date.setMonth(Math.random() > 0.25 ? now.getMonth() : now.getMonth() + 1);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
const getRandom = <T>(array: T[]) => {
  const id = Math.round(Math.random() * (array.length - 1));
  if (id < 0 || id >= array.length) {
    throw new Error("id is wrong");
  }
  return array[id];
};
const getInstances = <T>(func: new () => T, count: number) => {
  return Array(count)
    .fill(null)
    .map(() => new func());
};

async function init() {
  /*----------USERS----------*/
  class User {
    static id = 0;
    static logins = chance.unique(() => chance.twitter().substring(1), 100);
    id = crypto.randomUUID();
    name = chance.first();
    lastName = chance.last();
    middleName = chance.name({ middle: true }).split(" ").at(-1)!;
    login = User.logins[User.id++];
    supervisorId: string | null = null;
  }
  const users = getInstances(User, 10);

  const admin = {
    id: crypto.randomUUID(),
    name: "danil",
    lastName: "vedernikov",
    middleName: "dmitrievich",
    login: "admin",
    supervisorId: null,
  };
  const user = {
    id: crypto.randomUUID(),
    name: "qwe",
    lastName: "asd",
    middleName: "zxc",
    login: "user",
    supervisorId: admin.id,
  };

  /*----------URESRS-PASSWORDS----------*/
  const craetePasswords = async (count: number) => {
    const array = [];
    for (let i = 0; i < count; ++i) {
      const password = await bcrypt.hash(crypto.randomUUID(), 5);
      array.push(password);
    }
    return array;
  };
  const passwordList = await craetePasswords(users.length);
  class Password {
    static _id = 0;
    static users = _.shuffle(_.range(0, users.length)).map((id) => users[id]);
    userId = users[Password._id].id;
    password = passwordList[Password._id];
    constructor() {
      Password._id++;
    }
  }
  const passwords = getInstances(Password, users.length);
  users.push(user, admin);
  const adminPassword = await bcrypt.hash("admin", 5);
  const userPassword = await bcrypt.hash("user", 5);
  passwords.push(
    { userId: user.id, password: userPassword },
    { userId: admin.id, password: adminPassword }
  );

  /*----------TODOS----------*/
  class Todo implements Partial<ITodoRequest> {
    title = chance.sentence();
    description = chance.paragraph();
    expiresAt = toSQLDate(chance.date());
    priority = getRandom(Object.values(TodoPriorityEnum));
    status = getRandom(Object.values(TodoStatusEnum));
    creatorId = getRandom(users).id;
    responsibleId = getRandom(users).id;
  }
  const todos = getInstances(Todo, 100);

  return { users, todos, passwords };
}

export async function seed(knex: Knex): Promise<void> {
  const { users, todos, passwords } = await init();

  // Deletes ALL existing entries
  await knex("todos").del();
  await knex("tokens").del();
  await knex("users-passwords").del();
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert(users);
  await knex("users-passwords").insert(passwords);
  await knex("todos").insert(todos);
}
