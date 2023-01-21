export enum TodoPriorityEnum {
  low = "low",
  medium = "medium",
  high = "high",
}

export enum TodoStatusEnum {
  toBeDone = "toBeDone",
  inProgress = "inProgress",
  done = "done",
  canceled = "canceled",
}

interface ITodo {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  priority: TodoPriorityEnum;
  status: TodoStatusEnum;
  creatorId: string;
  responsibleId: string;
}

export interface ITodoRequest
  extends Omit<
    ITodo,
    "id" | "createdAt" | "updatedAt" | "creatorId" | "responsibleId"
  > {
  id?: number;
  creator: string;
  responsible: string;
}

export interface ITodoResponse extends ITodo {
  creator: string;
  responsible: string;
}

export default ITodo;
