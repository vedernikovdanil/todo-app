import React from "react";
import { Card } from "react-bootstrap";
import { StoreContext } from "../..";
import ITodoResponse from "../../interfaces/response/ITodoResponse";

function TodoItem(todo: ITodoResponse) {
  const { auth } = React.useContext(StoreContext);
  const cssClass = React.useMemo(() => {
    if (todo.status === "done") {
      return "success";
    } else if (new Date(todo.expiresAt).valueOf() < Date.now()) {
      return "danger";
    }
    return "secondary";
  }, [todo]);

  const created = new Date(todo.createdAt).toLocaleDateString();
  const updated = todo.updatedAt
    ? new Date(todo.updatedAt).toLocaleDateString()
    : "not updated";
  const expires = new Date(todo.expiresAt).toLocaleDateString();

  return (
    <Card className={`todo-item border border-2 border-${cssClass}`}>
      <Card.Body>
        <Card.Title className={`text-${cssClass}`}>{todo.title}</Card.Title>
        <div>Priority: {todo.priority}</div>
        <div>Created Date: {created}</div>
        <div>Updated Date: {updated}</div>
        <div>Expires Date: {expires}</div>
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
