import { Container } from "react-bootstrap";
import { Outlet, redirect } from "react-router-dom";
import Breadcrumb from "./components/Breadcrumb";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/loaders/ScrollToTop";
import { observer } from "mobx-react-lite";
import ErrorMessage from "./components/ErrorMessage";
import Authorization from "./components/loaders/Authorization";
import { StoreContextType } from ".";

export function loader({ auth }: StoreContextType) {
  return async function ({ params, request }: LoaderParams) {
    const url = new URL(request.url);
    const isAuthPath = ["/register", "/login"].includes(url.pathname);
    if (!auth.isAuth && !isAuthPath) {
      return redirect("/login");
    }
    if (localStorage.getItem("token") && !isAuthPath) {
      await auth.checkAuth();
    }
    return null;
  };
}

function App() {
  return (
    <>
      <Navbar className="mb-4" />
      <Container className="pb-5">
        <Authorization />
        <ScrollToTop />

        <Breadcrumb />
        <ErrorMessage />
        <Outlet />
      </Container>
    </>
  );
}

export default observer(App);
