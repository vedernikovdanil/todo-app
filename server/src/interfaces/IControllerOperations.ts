type IControllerOperations<
  TSource extends { id: string | number },
  TResponse extends {}
> = {
  [Key in keyof IServiceOperations<TSource, TResponse>]: Middleware;
};

export default IControllerOperations;
