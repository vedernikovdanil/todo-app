import ITodo from "../ITodo";

interface ITodoResponse extends ITodo {
  creator: string;
  responsible: string;
}

export default ITodoResponse;
