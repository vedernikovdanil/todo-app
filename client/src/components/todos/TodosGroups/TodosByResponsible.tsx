import _ from "lodash";
import React from "react";
import { ITodoResponse } from "../../../interfaces/ITodo";
import TodosList from "../TodosList";

function TodosByResponsible(props: {
  todos: ITodoResponse[];
  onClick?: (todo: ITodoResponse) => void;
}) {
  const todosByResponsible = React.useMemo(() => {
    return _.entries(_.groupBy(props.todos, "responsible"));
  }, [props.todos]);
  return (
    <>
      {todosByResponsible.map(([responsible, todos], index) => (
        <div key={`${responsible}-${index}`}>
          <h2 className="mb-3">{responsible}</h2>
          <TodosList todos={todos} onClick={props.onClick} />
          <hr />
        </div>
      ))}
    </>
  );
}

export default TodosByResponsible;
