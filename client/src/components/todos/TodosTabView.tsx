import React from "react";
import ITodoResponse from "../../interfaces/response/ITodoResponse";
import TodosList from "./TodosList";
import _ from "lodash";

export type TodosGroups = "createdAt" | "expiresAt" | "responsible";
export type TodosGroupDictionary<G extends TodosGroups> = G extends "expiresAt"
  ? Map<"today" | "week" | "more", ITodoResponse[]>
  : G extends "responsible"
  ? [string, ITodoResponse[]][]
  : ITodoResponse[];

function getGroupedTodos(todos: ITodoResponse[], group: TodosGroups) {
  const todosSortedByUpdated = todos.sort(
    (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
  );
  switch (group) {
    case "expiresAt":
      const todosSortedByExpires = todos.sort(
        (a, b) =>
          new Date(a.expiresAt).valueOf() - new Date(b.expiresAt).valueOf()
      );
      const today = new Date();
      return todosSortedByExpires.reduce<TodosGroupDictionary<"expiresAt">>(
        (acc, todo) => {
          const expiry = new Date(todo.expiresAt);
          if (expiry.getFullYear() >= today.getFullYear()) {
            const diff = expiry.valueOf() - today.valueOf();
            const diffDays = Math.ceil(diff / 1000 / 60 / 60 / 24);

            if (diffDays === 0) {
              acc.get("today")?.push(todo);
            } else if (diffDays > 0 && diffDays < 8) {
              acc.get("week")?.push(todo);
            } else if (diffDays > 7) {
              acc.get("more")?.push(todo);
            }
          }
          return acc;
        },
        new Map([
          ["today", []],
          ["week", []],
          ["more", []],
        ])
      );
    case "responsible":
      return _.entries(_.groupBy(todosSortedByUpdated, "responsible"));
    default:
      return todosSortedByUpdated;
  }
}

function TodosTabView(props: {
  todos: ITodoResponse[];
  group: TodosGroups;
  onClick?: (todo: ITodoResponse) => void;
}) {
  const todosGroup = React.useMemo(
    () => getGroupedTodos(props.todos, props.group),
    [props]
  );

  const Todos: typeof TodosList = (_props) => (
    <TodosList {..._props} onClick={props.onClick} />
  );

  switch (props.group) {
    case "expiresAt":
      const expireGroup = todosGroup as TodosGroupDictionary<"expiresAt">;
      const today = new Date();
      const tomorrow = new Date(today.valueOf() + 1000 * 60 * 60 * 24 * 1);
      const week = new Date(today.valueOf() + 1000 * 60 * 60 * 24 * 7);
      return (
        <>
          <h2 className="tab-view-header mb-3">
            Today&nbsp;
            <span className="h5 text-muted">
              ({today.toLocaleDateString()})
            </span>
            <hr />
          </h2>
          <Todos todos={expireGroup.get("today")} />
          <hr />
          <h2 className="tab-view-header mb-3">
            Week&nbsp;
            <span className="h5 text-muted">
              ({tomorrow.toLocaleDateString()} – {week.toLocaleDateString()})
            </span>
            <hr />
          </h2>
          <Todos todos={expireGroup.get("week")} />
          <hr />
          <h2 className="tab-view-header mb-3">
            More than a week&nbsp;
            <span className="h5 text-muted">
              ({week.toLocaleDateString()} {">"} …)
            </span>
            <hr />
          </h2>
          <Todos todos={expireGroup.get("more")} />
          <hr />
        </>
      );
    case "responsible":
      const responsibleGroup =
        todosGroup as TodosGroupDictionary<"responsible">;
      return (
        <>
          {responsibleGroup.map(([responsible, todos], index) => (
            <div key={`${responsible}-${index}`}>
              <h2 className="mb-3">{responsible}</h2>
              <Todos todos={todos} />
              <hr />
            </div>
          ))}
        </>
      );
    default:
      return <Todos todos={todosGroup as ITodoResponse[]} />;
  }
}

export default TodosTabView;
