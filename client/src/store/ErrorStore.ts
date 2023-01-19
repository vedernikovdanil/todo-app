import { makeAutoObservable } from "mobx";
import IHttpError from "../interfaces/IHttpError";

class ErrorStore {
  httpError: IHttpError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setError(error: IHttpError) {
    this.httpError = error;
  }

  closeError = () => {
    this.httpError = null;
  };
}

export default ErrorStore;
