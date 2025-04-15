export interface User {
  id: number;
  name: string;
  email: string;
}

export interface IdParam {
  id: string;
}

export interface JwtPayload {
  email: string
}
