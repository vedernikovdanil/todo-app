import IRegisterRequest from "../../interfaces/request/IRegisterRequest";
import { Validation, Field } from "../Validation";

class RegisterValidation extends Validation<IRegisterRequest> {
  constructor() {
    super({
      name: new Field("Name", {
        required: true,
        minLength: 2,
        maxLength: 50,
      }),
      lastName: new Field("Last name", {
        required: true,
        minLength: 2,
        maxLength: 50,
      }),
      middleName: new Field("Middle name", {
        required: true,
        minLength: 2,
        maxLength: 50,
      }),
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

export default RegisterValidation;
