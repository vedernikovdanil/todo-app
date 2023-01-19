import $axios from "../http";
import ITodo from "../interfaces/ITodo";
import ITodoRequest from "../interfaces/request/ITodoRequest";
import ITodoResponse from "../interfaces/response/ITodoResponse";

class TodoService {
  async fetchTodosToUser() {
    return await $axios.get<ITodoResponse[]>("/todos");
  }

  async fetchTodosByUser() {
    return await $axios.get<ITodoResponse[]>("/my-todos");
  }

  async addTodo(todo: ITodoRequest) {
    return await $axios.post<ITodoResponse>("/todos", todo);
  }

  async editTodo(id: number, todo: ITodoRequest) {
    return await $axios.patch<ITodoResponse>(`/todos/${id}`, todo);
  }

  async searchTodos(todo: Partial<ITodo>) {
    const searchParams = new URLSearchParams();
    Object.entries(todo).forEach(([key, value]) => {
      searchParams.set(key, `${value || ""}`);
    });
    const query = searchParams.toString();
    return await $axios.get<ITodoResponse[]>(`/users/search?${query}`);
  }
}

export default TodoService;
