import { Base } from './base';
import { Roles } from './roles';

export namespace Users {
  export interface LoginDetails {
    email: string;
    password: string;
  }

  export interface CreateRequest extends LoginDetails {
    name: string;
  }

  export interface User extends Base.Record {
    email: string;
    roles: Roles.Type[];
    isVerified: boolean;
  }

  export interface TokenResponse {
    token: string;
  }
}
