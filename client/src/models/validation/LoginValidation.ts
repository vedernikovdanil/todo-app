import { Validation, Field } from "../Validation";

export interface ILoginRequest {
  login: string;
  password: string;
}

class LoginValidation extends Validation<ILoginRequest> {
  constructor() {
    super({
      login: new Field("Login", {
        required: true,
        minLength: 4,
        maxLength: 50,
      }),
      password: new Field("Password", {
        required: true,
        minLength: 4,
        maxLength: 50,
      }),
    });
  }
}

export default LoginValidation;
