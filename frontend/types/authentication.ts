export interface IUser {
  username: string;
  email?: string;
  token?: string;
  first_name?: string;
}

export interface IAuthResponse {
  user: IUser;
  access: string;
  refresh: string;
}
