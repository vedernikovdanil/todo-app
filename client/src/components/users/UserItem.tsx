import React from "react";
import { Card } from "react-bootstrap";
import { StoreContext } from "../..";
import { IUserResponse } from "../../interfaces/IUser";

function UserItem(user: IUserResponse) {
  const { auth } = React.useContext(StoreContext);

  const isSubordinate = auth.isAuth && auth.user?.login === user.supervisor;
  return (
    <Card className={isSubordinate ? "border-2 border-primary" : ""}>
      <Card.Body>
        <Card.Title>{user.login}</Card.Title>
        <div>
          {user.name} {user.lastName} {user.middleName}
        </div>
        <div>supervisor: {user.supervisor || "none"}</div>
      </Card.Body>
    </Card>
  );
}

export default UserItem;
