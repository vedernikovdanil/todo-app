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
import ILoginRequest from "../../interfaces/request/ILoginRequest";

const validationConfig = new LoginValidation().config();

export const loader: LoaderType = (store) => async (props) => {
  return store.auth.isAuth ? redirect("/") : null;
};

export const action: LoaderType = (store) => async (props) => {
  const formData = await props.request.formData();
  const request = Object.fromEntries(formData as any) as ILoginRequest;
  await store.auth.login(request);
  return store.auth.isAuth ? redirect("/todos") : null;
};

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
