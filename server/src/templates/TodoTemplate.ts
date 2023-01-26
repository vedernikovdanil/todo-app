import Chance from "chance";
import ITodo, { TodoPriorityEnum, TodoStatusEnum } from "../interfaces/ITodo";
import * as utils from "../utils";
import UserTemplate from "./UserTemplate";

const chance = new Chance();

class TodoTemplate implements Omit<ITodo, "id" | "createdAt" | "updatedAt"> {
  title = chance.sentence();
  description = chance.paragraph();
  expiresAt = utils.toSQLDate(TodoTemplate.getNearestDate());
  priority = utils.getRandom(Object.values(TodoPriorityEnum));
  status = utils.getRandom(Object.values(TodoStatusEnum));
  creatorId: string;
  responsibleId: string;

  constructor(users: UserTemplate[]) {
    this.creatorId = UserTemplate.getSupervisor(users).id;
    this.responsibleId = UserTemplate.getSubordinate(this.creatorId, users).id;
  }

  static getNearestDate() {
    const date = chance.date();
    date.setFullYear(date.getFullYear());
    date.setMonth(date.getMonth());
    return date;
  }
}

export default TodoTemplate;
