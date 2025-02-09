export interface IUser {
  username: string;
  email: string;
}

export interface IAuthResponse {
  refresh: string;
  access: string;
}
