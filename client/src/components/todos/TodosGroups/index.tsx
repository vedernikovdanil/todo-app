import _ from "lodash";
import React from "react";
import TodosList from "../TodosList";
import { ITodoResponse } from "../../../interfaces/ITodo";
import TodosByExpire, { groupTodosByExpire } from "./TodosByExpire";

export type TodosGroupsType = "createdAt" | "expiresAt" | "responsible";
export type TodosGroupsByExpire = "today" | "week" | "more";
export type TodosGroupDictionary<T extends TodosGroupsType> =
  T extends "expiresAt"
    ? Map<TodosGroupsByExpire, ITodoResponse[]>
    : T extends "responsible"
    ? [string, ITodoResponse[]][]
    : ITodoResponse[];

function getTodosGroup(todos: ITodoResponse[], group: TodosGroupsType) {
  const todosSortedByUpdated = todos.sort(
    (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
  );
  switch (group) {
    case "expiresAt":
      return groupTodosByExpire(todosSortedByUpdated);
    case "responsible":
      return _.entries(_.groupBy(todosSortedByUpdated, "responsible"));
    default:
      return todosSortedByUpdated;
  }
}

function TodosGroups(props: {
  todos: ITodoResponse[];
  group: TodosGroupsType;
  onClick?: (todo: ITodoResponse) => void;
}) {
  const { todos, group, onClick } = props;
  const todosGroup = React.useMemo(() => getTodosGroup(todos, group), [props]);

  switch (group) {
    case "expiresAt":
      const todosExpire = todosGroup as TodosGroupDictionary<typeof group>;
      return <TodosByExpire todosGroup={todosExpire} onClick={onClick} />;
    case "responsible":
      const todosResponsible = todosGroup as TodosGroupDictionary<typeof group>;
      return (
        <>
          {todosResponsible.map(([responsible, todos], index) => (
            <div key={`${responsible}-${index}`}>
              <h2 className="mb-3">{responsible}</h2>
              <TodosList todos={todos} onClick={onClick} />
              <hr />
            </div>
          ))}
        </>
      );
    default:
      return (
        <TodosList todos={todosGroup as ITodoResponse[]} onClick={onClick} />
      );
  }
}

export default TodosGroups;
