import React from "react";
import { observer } from "mobx-react-lite";
import { Alert, CloseButton } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { StoreContext } from "..";

interface ValidationError {
  msg: string;
  param: string;
  location: string;
}

function ErrorMessage() {
  const { error } = React.useContext(StoreContext);
  const { pathname } = useLocation();
  const isShowedRef = React.useRef(false);

  React.useLayoutEffect(() => {
    const hasError = !!error.httpError;
    if (hasError && isShowedRef.current) {
      error.closeError();
    }
    // eslint-disable-next-line
  }, [pathname]);

  React.useEffect(() => {
    isShowedRef.current = !!error.httpError;
  }, [error.httpError]);

  function isValidationError(err: any): err is ValidationError {
    return "msg" in err && "param" in err;
  }

  return (
    <>
      {error.httpError ? (
        <Alert variant="danger">
          <CloseButton className="float-end" onClick={error.closeError} />
          <div>{error.httpError.message}</div>
          {error.httpError.errors?.length ? (
            <ul>
              {error.httpError.errors.map(
                (error, index) =>
                  isValidationError(error) && (
                    <li key={index}>
                      {error.param}: {error.msg}
                    </li>
                  )
              )}
            </ul>
          ) : undefined}
        </Alert>
      ) : undefined}
    </>
  );
}

export default observer(ErrorMessage);
