import knex from "../persistence";
import ITodo, { ITodoResponse } from "../interfaces/ITodo";
import UserService from "./UserService";
import Service from "../models/Service";

class TodoService extends Service<ITodo, ITodoResponse> {
  query = () =>
    knex("todos as t")
      .select<ITodoResponse[]>(
        "t.*",
        "c.login as creator",
        "r.login as responsible"
      )
      .leftJoin("users as c", "c.id", "creatorId")
      .leftJoin("users as r", "r.id", "responsibleId");
  alias = "t";
  userService = new UserService();

  override async add(item: Partial<ITodo>) {
    item.updatedAt = new Date().toISOString();
    return await super.add(item);
  }

  override async edit(id: string | number, item: Partial<ITodo>) {
    item.updatedAt = new Date().toISOString();
    return await super.edit(id, item);
  }
}

export default TodoService;
