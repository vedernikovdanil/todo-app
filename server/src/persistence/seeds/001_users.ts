import bcrypt from "bcryptjs";
import _ from "lodash";
import { Knex } from "knex";
import * as utils from "../../utils";
import UserTemplate from "../../templates/UserTemplate";
import TodoTemplate from "../../templates/TodoTemplate";
import PasswordTemplate from "../../templates/PasswordTemplate";

async function init() {
  /*----------USERS----------*/
  const admin = {
    id: crypto.randomUUID(),
    name: "danil",
    lastName: "vedernikov",
    middleName: "dmitrievich",
    login: "admin",
    supervisorId: "",
  };
  const adminPassword = await bcrypt.hash("admin", 5);

  const user = {
    id: crypto.randomUUID(),
    name: "qwe",
    lastName: "asd",
    middleName: "zxc",
    login: "user",
    supervisorId: admin.id,
  };
  const userPassword = await bcrypt.hash("user", 5);

  const users = utils
    .getInstances(() => new UserTemplate(), 10)
    .map((user, _, array) => ({
      ...user,
      supervisorId: Math.random() > 0.5 ? admin.id : utils.getRandom(array).id,
    }));
  admin.supervisorId = utils.getRandom(users).id;

  /*----------URESRS-PASSWORDS----------*/
  const passwordsRaw = await PasswordTemplate.createPasswords(users.length);
  const passwords = utils.getInstances(
    () => new PasswordTemplate(users, passwordsRaw),
    users.length
  );
  users.push(user, admin);
  passwords.push(
    { userId: user.id, password: userPassword },
    { userId: admin.id, password: adminPassword }
  );

  /*----------TODOS----------*/
  const todos = utils.getInstances(() => new TodoTemplate(users), 100);

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
