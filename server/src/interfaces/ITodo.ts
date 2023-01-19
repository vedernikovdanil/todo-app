import { TodoPriorityEnum, TodoStatusEnum } from "./enums/TodoEnum";

interface ITodo {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  updatedAt: string;
  priority: TodoPriorityEnum;
  status: TodoStatusEnum;
  creatorId: string;
  responsibleId: string;
}

export default ITodo;
