import React from "react";
import TodosList from "../TodosList";
import { ITodoResponse } from "../../../interfaces/ITodo";
import TodosByExpire from "./TodosByExpire";
import TodosByResponsible from "./TodosByResponsible";

export type TodosGroupsType = "createdAt" | "expiresAt" | "responsible";

function TodosGroups(props: {
  todos: ITodoResponse[];
  group: TodosGroupsType;
  onClick?: (todo: ITodoResponse) => void;
}) {
  const sortedTodos = React.useMemo(() => {
    return props.todos.sort(
      (a, b) =>
        new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
    );
  }, [props]);

  switch (props.group) {
    case "expiresAt":
      return <TodosByExpire todos={sortedTodos} onClick={props.onClick} />;
    case "responsible":
      return <TodosByResponsible todos={sortedTodos} onClick={props.onClick} />;
    default:
      return <TodosList todos={sortedTodos} onClick={props.onClick} />;
  }
}

export default TodosGroups;
