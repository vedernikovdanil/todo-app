import { Card } from "react-bootstrap";
import IUserResponse from "../../interfaces/response/IUserResponse";

function UserItem(user: IUserResponse) {
  return (
    <Card>
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
