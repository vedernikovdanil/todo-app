import React from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { Form as FormRouter, useSubmit } from "react-router-dom";
import { useForm, UseFormHandleSubmit } from "react-hook-form";
import FormError from "../FormError";
import { StoreContext } from "../..";
import TodoValidation from "../../models/validation/TodoValidation";
import {
  ITodoRequest,
  TodoPriorityEnum,
  TodoStatusEnum,
} from "../../interfaces/ITodo";
import { IUserResponse } from "../../interfaces/IUser";

export type TodoFormHandle = {
  handleSubmit: UseFormHandleSubmit<ITodoRequest>;
  submit: () => void;
};

const TodoForm = React.forwardRef<
  TodoFormHandle,
  {
    todo?: ITodoRequest;
    users: IUserResponse[];
    className?: string;
  }
>((props, ref) => {
  const { auth } = React.useContext(StoreContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITodoRequest>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  const validationConfig = React.useMemo(
    () => new TodoValidation(auth.user!, props.todo).config(),
    [props.todo, auth.user]
  );

  React.useImperativeHandle(ref, () => ({
    handleSubmit,
    submit: () => submit(formRef.current),
  }));

  const isCreator =
    !props.todo?.creator || auth.user?.login === props.todo?.creator;

  return (
    <FormRouter
      method="post"
      action="/todos"
      ref={formRef}
      className={props.className || ""}
    >
      <input name="id" value={props.todo?.id} readOnly hidden />
      <FloatingLabel label="Title">
        <Form.Control
          type="text"
          placeholder="Title"
          disabled={!isCreator}
          {...register("title", validationConfig.title)}
        />
      </FloatingLabel>
      <FormError message={errors.title?.message} />
      <FloatingLabel label="Description">
        <Form.Control
          as="textarea"
          style={{ height: "100px" }}
          placeholder="Description"
          disabled={!isCreator}
          {...register("description", validationConfig.description)}
        />
      </FloatingLabel>
      <FormError message={errors.description?.message} />
      <FloatingLabel label="Expires">
        <Form.Control
          type="date"
          placeholder="Expires"
          disabled={!isCreator}
          {...register("expiresAt", validationConfig.expiresAt)}
        />
      </FloatingLabel>
      <FormError message={errors.expiresAt?.message} />
      <Form.Select
        defaultValue=""
        disabled={!isCreator}
        {...register("priority", validationConfig.priority)}
      >
        <option value="" disabled>
          Priority
        </option>
        {Object.values(TodoPriorityEnum).map((priority, index) => (
          <option key={index} value={priority}>
            {priority}
          </option>
        ))}
      </Form.Select>
      <FormError message={errors.priority?.message} />
      <div>
        {Object.values(TodoStatusEnum).map((status, index) => (
          <Form.Check
            key={index}
            type="radio"
            label={status}
            value={status}
            id={`radio-todo-status-${status}`}
            defaultChecked={props.todo?.status === status}
            {...register("status", validationConfig.status)}
          />
        ))}
      </div>
      <FormError message={errors.status?.message} />
      <FloatingLabel label="Creator">
        <Form.Control
          type="text"
          placeholder="Creator"
          value={props.todo?.creator || auth.user?.login}
          disabled
        />
      </FloatingLabel>
      <FormError />
      <FloatingLabel label="Responsible">
        <Form.Control
          type="text"
          placeholder="Responsible"
          list="users-datalist"
          disabled={!isCreator}
          {...register("responsible", validationConfig.responsible)}
        />
        <datalist id="users-datalist">
          {[...props.users, auth.user!]?.map((user, index) => (
            <option key={index} value={user.login}>
              {user.name} {user.lastName} {user.middleName}
            </option>
          ))}
        </datalist>
      </FloatingLabel>
      <FormError message={errors.responsible?.message} />
    </FormRouter>
  );
});

export default TodoForm;
