import { ITodoRequest } from "../../interfaces/ITodo";
import { IUserResponse } from "../../interfaces/IUser";
import { Validation, Field } from "../Validation";

class TodoValidation extends Validation<ITodoRequest> {
  constructor(user: IUserResponse, todo?: Partial<ITodoRequest>) {
    super({
      title: new Field("Title", { required: true, value: todo?.title }),
      description: new Field("Description", { value: todo?.description }),
      expiresAt: new Field("Expires", {
        required: true,
        value: todo?.expiresAt
          ? Validation.toDateString(new Date(todo.expiresAt))
          : undefined,
        // validate: (v: string) =>
        //   new Date(v).valueOf() >= new Date().valueOf() ||
        //   "End date must be greater than current",
      }),
      priority: new Field("Priority", {
        required: true,
        value: todo?.priority,
      }),
      status: new Field("Status", { required: true, value: todo?.status }),
      creator: new Field("Creator", { required: true, value: user.login }),
      responsible: new Field("Responsible", {
        required: true,
        value: todo?.responsible || user.login,
      }),
    });
  }
}

export default TodoValidation;
