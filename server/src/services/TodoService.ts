import knex from "../persistence";
import ITodo, { ITodoResponse } from "../interfaces/ITodo";
import KnexOperations from "../utils/KnexOperations";

class TodoService
  extends KnexOperations<ITodo, ITodoResponse>
  implements IServiceOperations<ITodo, ITodoResponse>
{
  constructor() {
    const query = () =>
      knex("todos as t")
        .select<ITodoResponse[]>(
          "t.*",
          "c.login as creator",
          "r.login as responsible"
        )
        .leftJoin("users as c", "c.id", "creatorId")
        .leftJoin("users as r", "r.id", "responsibleId");

    super(query, "t");
  }

  override async create(item: Partial<ITodo>) {
    item.updatedAt = new Date().toISOString();
    return await super.create(item);
  }

  override async edit(id: ITodo["id"], item: Partial<ITodo>) {
    item.updatedAt = new Date().toISOString();
    return await super.edit(id, item);
  }
}

export default TodoService;
