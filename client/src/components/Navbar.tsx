import { observer } from "mobx-react-lite";
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Form as FormRouter, NavLink } from "react-router-dom";
import { StoreContext } from "..";

function NavbarComponent(props: { className?: string }) {
  const { auth } = React.useContext(StoreContext);

  return (
    <Navbar bg="primary" variant="dark" className={props.className || ""}>
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Todo App
        </Navbar.Brand>
        <Nav className="me-auto">
          {auth.isAuth ? (
            <div className="d-flex">
              <Nav.Link as={NavLink} to="/users">
                Users
              </Nav.Link>
              <Nav.Link as={NavLink} to="/todos">
                Todos
              </Nav.Link>
            </div>
          ) : undefined}
        </Nav>
        <Nav className="ms-auth">
          <div className="d-flex align-items-baseline ms-auto">
            {auth.isAuth ? (
              <>
                <Nav.Link as="span" active>
                  <i className="bi bi-person-circle me-1" />
                  {auth.user?.login}
                </Nav.Link>
                <FormRouter method="post" action="/logout">
                  <Nav.Link as="button" type="submit" className="btn">
                    Logout
                  </Nav.Link>
                </FormRouter>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default observer(NavbarComponent);
