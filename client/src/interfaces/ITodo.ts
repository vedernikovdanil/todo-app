import { TodoPriorityEnum, TodoStatusEnum } from "./enums/TodoEnums";

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

export default ITodo;
