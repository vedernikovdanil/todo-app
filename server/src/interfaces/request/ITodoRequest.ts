import ITodo from "../ITodo";

interface ITodoRequest
  extends Omit<ITodo, "id" | "createdAt" | "updatedAt" | "responsibleId"> {
  responsible?: string;
}

export default ITodoRequest;
