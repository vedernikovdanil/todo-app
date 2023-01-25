class HttpError {
  constructor(
    public status: number,
    public message: string,
    public errors?: any[]
  ) {}

  static Unauthorized() {
    return new HttpError(401, "User not authorized");
  }

  static BadRequest(message: string, errors?: any[]) {
    return new HttpError(400, message, errors);
  }

  static NotFound(message: string, errors?: any[]) {
    return new HttpError(404, message, errors);
  }

  static NotValidated(errors?: any[]) {
    return new HttpError(400, "The entered data was not validated", errors);
  }

  static NotExist(name: string, value: string, errors?: any[]) {
    return new HttpError(400, `${name} '${value}' does not exist`, errors);
  }

  static Forbidden(message?: string, errors?: any[]) {
    return new HttpError(
      403,
      `Access denied${message ? `: ${message}` : ""}`,
      errors
    );
  }
}

export default HttpError;
