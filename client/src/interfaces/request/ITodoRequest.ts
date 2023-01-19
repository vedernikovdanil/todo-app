import ITodo from "../ITodo";

interface ITodoRequest
  extends Omit<
    ITodo,
    "id" | "createdAt" | "updatedAt" | "creatorId" | "responsibleId"
  > {
  id?: number;
  creator: string;
  responsible: string;
}

export default ITodoRequest;
