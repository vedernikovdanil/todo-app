import { redirect } from "react-router-dom";

export const action: LoaderType = (store) => async (props) => {
  await store.auth.logout();
  return redirect("/login");
};

function Logout() {
  return null;
}

export default Logout;
