import { TodosGroupsByExpire, TodosGroupDictionary } from ".";
import { ITodoResponse } from "../../../interfaces/ITodo";
import TodosList from "../TodosList";

export function groupTodosByExpire(todos: ITodoResponse[]) {
  const todosSortedByExpires = todos.sort(
    (a, b) => new Date(a.expiresAt).valueOf() - new Date(b.expiresAt).valueOf()
  );
  const today = new Date();
  return todosSortedByExpires.reduce<TodosGroupDictionary<"expiresAt">>(
    (acc, todo) => {
      const expiry = new Date(todo.expiresAt);
      if (expiry.getFullYear() >= today.getFullYear()) {
        const diff = expiry.valueOf() - today.valueOf();
        const diffDays = Math.ceil(diff / 1000 / 60 / 60 / 24);
        if (diffDays === 1) {
          acc.get("today")?.push(todo);
        } else if (diffDays > 1 && diffDays < 9) {
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
}

function TodosByExpire(props: {
  todosGroup: TodosGroupDictionary<"expiresAt">;
  onClick?: (todo: ITodoResponse) => void;
}) {
  const today = new Date();
  const tomorrow = new Date(today.valueOf() + 1000 * 60 * 60 * 24 * 1);
  const week = new Date(today.valueOf() + 1000 * 60 * 60 * 24 * 8);
  const afterWeek = new Date(week.valueOf() + 1000 * 60 * 60 * 24 * 1);

  const rangeDates = new Map<
    [group: TodosGroupsByExpire, title: string],
    [start: string, end: string | null]
  >([
    [
      ["today", "Today"],
      [today.toLocaleDateString(), null],
    ],
    [
      ["week", "Week"],
      [tomorrow.toLocaleDateString(), week.toLocaleDateString()],
    ],
    [
      ["more", "More than a week"],
      [afterWeek.toLocaleDateString(), "…"],
    ],
  ]);

  return (
    <>
      {[...rangeDates.entries()].map(([[group, title], [start, end]]) => (
        <div key={group} className="mb-3">
          <h2 className="tab-view-header mb-3">
            {title}&nbsp;
            <span className="h5 text-muted">
              ({start}
              {end ? ` - ${end}` : undefined})
            </span>
            <hr />
          </h2>
          <TodosList
            todos={props.todosGroup.get(group)}
            onClick={props.onClick}
          />
        </div>
      ))}
    </>
  );
}

export default TodosByExpire;
