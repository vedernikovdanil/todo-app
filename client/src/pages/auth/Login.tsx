import React from "react";
import { Row, Col, Form, Button, FloatingLabel } from "react-bootstrap";
import {
  Form as FormRouter,
  NavLink,
  redirect,
  useSubmit,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import LoginValidation from "../../models/validation/LoginValidation";
import { StoreContextType } from "../..";
import ILoginRequest from "../../interfaces/ILoginRequest";

const validationConfig = new LoginValidation().config();

export function loader({ auth }: StoreContextType) {
  return async function ({ params, request }: LoaderParams) {
    return auth.isAuth ? redirect("/") : null;
  };
}

export function action({ auth }: StoreContextType) {
  return async function ({ params, request }: LoaderParams) {
    const formData = await request.formData();
    const loginData = Object.fromEntries(formData as any) as ILoginRequest;
    await auth.login(loginData);
    return auth.isAuth ? redirect("/todos") : null;
  };
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  return (
    <FormRouter
      method="post"
      onSubmit={handleSubmit(() => submit(formRef.current))}
      ref={formRef}
    >
      <h1>Login</h1>
      <Row>
        <Col md="6">
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
        Login
      </Button>
      <div>
        Not registered yet? <NavLink to="/register">Registration</NavLink>
      </div>
    </FormRouter>
  );
}

export default Login;
