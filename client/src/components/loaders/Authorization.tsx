import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../..";

function Authorization() {
  const { auth } = React.useContext(StoreContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    const isAuthPath = ["/register", "/login"].includes(pathname);
    if (!auth.isAuth && !isAuthPath) {
      return navigate("/login");
    }
    if (auth.isAuth && isAuthPath) {
      return navigate("/");
    }
    // eslint-disable-next-line
  }, [pathname]);

  return null;
}

export default Authorization;
