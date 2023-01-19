interface IUser {
  id: string;
  name: string;
  lastName: string;
  middleName: string;
  login: string;
  supervisorId: string | null;
}

export default IUser;
