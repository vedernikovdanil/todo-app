import React from "react";
import { Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";
import {
  Form as FormRouter,
  NavLink,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import RegisterValidation, {
  IRegisterRequest,
} from "../../models/validation/RegisterValidation";
import { IUserResponse } from "../../interfaces/IUser";
import { StoreContextType } from "../..";

const validationConfig = new RegisterValidation().config();

export function loader({ auth }: StoreContextType) {
  return async function ({ params, request }: LoaderParams) {
    if (auth.isAuth) {
      return redirect("/");
    }
    const response = await new UserService().fetchUsers();
    return response?.status === 200 ? response.data : null;
  };
}

export function action({ auth }: StoreContextType) {
  return async function ({ params, request }: LoaderParams) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData as any) as IRegisterRequest;
    const response = await new AuthService().register(data);
    return response?.status === 200 ? redirect("/login") : null;
  };
}

function Register() {
  const users = useLoaderData() as IUserResponse[] | null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterRequest>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  return (
    <FormRouter
      method="post"
      onSubmit={handleSubmit(() => submit(formRef.current))}
      ref={formRef}
    >
      <h1>Registration</h1>
      <Row>
        <Col md="6">
          <h4 className="text-muted">Personal data</h4>
          <FloatingLabel label="Name">
            <Form.Control
              type="text"
              placeholder="Name"
              {...register("name", validationConfig.name)}
            />
          </FloatingLabel>
          <FormError message={errors.name?.message} />
          <FloatingLabel label="Last name">
            <Form.Control
              type="text"
              placeholder="Last name"
              {...register("lastName", validationConfig.lastName)}
            />
          </FloatingLabel>
          <FormError message={errors.lastName?.message} />
          <FloatingLabel label="Middle name">
            <Form.Control
              type="text"
              placeholder="Middle name"
              {...register("middleName", validationConfig.middleName)}
            />
          </FloatingLabel>
          <FormError message={errors.middleName?.message} />
          <FloatingLabel label="Supervisor (optional)">
            <Form.Control
              type="search"
              placeholder="Supervisor"
              list="users-datalist"
              {...register("supervisor")}
            />
            <datalist id="users-datalist">
              {users?.map((user, index) => (
                <option key={index} value={user.login}>
                  {user.name} {user.lastName} {user.middleName}
                </option>
              ))}
            </datalist>
          </FloatingLabel>
          <FormError />
        </Col>
        <Col>
          <h4 className="text-muted">Authorization data</h4>
          <FloatingLabel label="Login">
            <Form.Control
              type="text"
              placeholder="Login"
              {...register("login", validationConfig.login)}
            />
          </FloatingLabel>
          <FormError message={errors.login?.message} />
          <FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", validationConfig.password)}
            />
          </FloatingLabel>
          <FormError message={errors.password?.message} />
        </Col>
      </Row>
      <Button type="submit" className="w-auto px-5 mb-5">
        Registration
      </Button>
      <div>
        Already registered? <NavLink to="/login">Login</NavLink>
      </div>
    </FormRouter>
  );
}

export default Register;
