export interface IUser {
  username: string;
  email?: string;
  token?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
