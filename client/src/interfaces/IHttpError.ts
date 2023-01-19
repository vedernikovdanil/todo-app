interface IHttpError {
  status: number;
  message: string;
  errors?: any[];
}

export default IHttpError;
