import { useLoaderData } from "react-router-dom";
import UserItem from "../components/users/UserItem";
import IUserResponse from "../interfaces/response/IUserResponse";
import UserService from "../services/UserService";

export const loader: LoaderType = (store) => async (props) => {
  const response = await new UserService().fetchUsers();
  return response?.status === 200 ? response.data : null;
};

function Users() {
  const users = useLoaderData() as IUserResponse[] | null;

  return (
    <div className="d-flex flex-column gap-3">
      {users?.map((user) => (
        <UserItem key={user.id} {...user} />
      ))}
    </div>
  );
}

export default Users;
