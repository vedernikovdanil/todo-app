import ITodoResponse from "../../interfaces/response/ITodoResponse";
import TodoItem from "./TodoItem";

function TodosList(props: {
  todos?: ITodoResponse[];
  className?: string;
  onClick?: (todo: ITodoResponse) => void;
}) {
  return (
    <div className={`d-flex flex-column gap-3 ${props.className}`}>
      {props.todos?.length ? (
        props.todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => props.onClick && props.onClick(todo)}
            style={{ cursor: props.onClick ? "pointer" : "default" }}
          >
            <TodoItem {...todo} />
          </div>
        ))
      ) : (
        <h4 className="text-muted">There is nothing</h4>
      )}
    </div>
  );
}

export default TodosList;
