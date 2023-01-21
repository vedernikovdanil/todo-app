import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import { StoreContext, StoreContextType } from "..";
import ModalComponent from "../components/ModalComponent";
import TodoForm, { TodoFormHandle } from "../components/todos/TodoForm";
import TodosGroups, { TodosGroupsType } from "../components/todos/TodosGroups";
import TodosSettings from "../components/todos/TodosSortPanel";
import { ITodoRequest, ITodoResponse } from "../interfaces/ITodo";
import TodoService from "../services/TodoService";
import UserService from "../services/UserService";

const todoServoce = new TodoService();
const userService = new UserService();

export const loader =
  ({ auth }: StoreContextType) =>
  async (props: LoaderParams) => {
    return {
      todosByUser: (await todoServoce.fetchTodosByUser())?.data,
      todosForUser: (await todoServoce.fetchTodosToUser())?.data,
      users: (await userService.getSubordinates(auth.user!.id))?.data,
      url: new URL(props.request.url),
    };
  };

export const action: LoaderType =
  ({ modal }) =>
  async (props) => {
    const formData = await props.request.formData();
    const data = Object.fromEntries(formData as any) as ITodoRequest;
    const { id, ...dataToSend } = data;
    const response = id
      ? await new TodoService().editTodo(id, dataToSend)
      : await new TodoService().addTodo(dataToSend);
    if (response?.status === 200) {
      modal.hideAll();
      return response;
    }
    return null;
  };

function TodosPage() {
  const { modal } = React.useContext(StoreContext);
  const { todosByUser, todosForUser, users } =
    useLoaderData() as LoaderReturnType<typeof loader>;
  const [group, setGroup] = React.useState<TodosGroupsType>("expiresAt");
  const [editTodo, setEditTodo] = React.useState<ITodoResponse>();
  const formRef = React.useRef<TodoFormHandle>(null);
  const modalId = React.useRef("add-edit-modal");

  const showModalAddTodo = () => {
    setEditTodo(undefined);
    modal.setTitle(modalId.current, "Add new Todo");
    modal.show(modalId.current);
  };
  const showModalEditTodo = (todo: ITodoResponse) => {
    setEditTodo(todo);
    modal.setTitle(modalId.current, "Edit Todo");
    modal.show(modalId.current);
  };
  const handleSubmit = () => {
    formRef.current?.handleSubmit(
      (data) => formRef.current?.submit(),
      (error) => console.log("error", error)
    )();
  };

  return (
    <div>
      <ModalComponent id={modalId.current} onSaveChanges={handleSubmit}>
        <TodoForm
          todo={editTodo}
          users={users}
          className="w-100"
          ref={formRef}
        />
      </ModalComponent>
      <TodosSettings
        group={group}
        setGroup={setGroup}
        showModalAddTodo={showModalAddTodo}
        className="mb-3"
      />
      <Tabs justify defaultActiveKey="forMe" className="mb-3">
        <Tab eventKey="forMe" title="Assigned to me">
          <TodosGroups
            todos={todosForUser}
            group={group}
            onClick={showModalEditTodo}
          />
        </Tab>
        <Tab eventKey="byMe" title="Created by me">
          <TodosGroups
            todos={todosByUser}
            group={group}
            onClick={showModalEditTodo}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default TodosPage;
