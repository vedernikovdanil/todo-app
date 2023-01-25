import React from "react";
import { Card } from "react-bootstrap";
import { StoreContext } from "../..";
import { ITodoResponse } from "../../interfaces/ITodo";
import DateString from "../DateString";

function TodoItem(todo: ITodoResponse) {
  const { auth } = React.useContext(StoreContext);
  const cssClass = React.useMemo(() => {
    if (todo.status === "done") {
      return "success";
    } else if (new Date(todo.expiresAt).getDate() < new Date().getDate()) {
      return "danger";
    }
    return "secondary";
  }, [todo]);

  return (
    <Card className={`todo-item border border-2 border-${cssClass}`}>
      <Card.Body>
        <Card.Title className={`text-${cssClass}`}>{todo.title}</Card.Title>
        <div>Priority: {todo.priority}</div>
        <div>
          Created Date: <DateString date={todo.createdAt} />
        </div>
        <div>
          Updated Date: <DateString date={todo.updatedAt} />
        </div>
        <div>
          Expires Date: <DateString date={todo.expiresAt} />
        </div>
        <div>Status: {todo.status}</div>
        <div>
          Creator: {todo.creator}
          {todo.creator === auth.user?.login ? " (You)" : undefined}
        </div>
        <div>
          Responsible: {todo.responsible}
          {todo.responsible === auth.user?.login ? " (You)" : undefined}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TodoItem;
