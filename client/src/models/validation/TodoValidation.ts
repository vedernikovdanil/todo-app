import ITodoRequest from "../../interfaces/request/ITodoRequest";
import IUserResponse from "../../interfaces/response/IUserResponse";
import { Validation, Field } from "../Validation";

class TodoValidation extends Validation<ITodoRequest> {
  constructor(user: IUserResponse, todo?: Partial<ITodoRequest>) {
    super({
      title: new Field("Title", { required: true }),
      description: new Field("Description"),
      expiresAt: new Field("Expires", {
        required: true,
        validate: (v: string) =>
          new Date(v).valueOf() > Date.now() ||
          "End date must be greater than current",
      }),
      priority: new Field("Priority", { required: true }),
      status: new Field("Status", { required: true }),
      creator: new Field("Creator", { required: true, value: user.login }),
      responsible: new Field("Responsible", { required: true }),
    });
    if (todo) {
      this.fields.title!.setValue(todo.title);
      this.fields.description!.setValue(todo.description);
      this.fields.expiresAt!.setValue(
        Validation.toDateString(
          todo?.expiresAt ? new Date(todo.expiresAt) : undefined
        )
      );
      this.fields.priority!.setValue(todo.priority);
      this.fields.status!.setValue(todo.status);
      this.fields.creator!.setValue(todo.creator);
      this.fields.responsible!.setValue(todo.responsible);
    } else {
      this.fields.responsible!.setValue(user.login);
    }
  }
}

export default TodoValidation;
