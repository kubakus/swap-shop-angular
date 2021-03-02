import { Base } from "./base";

export namespace Users {
    export interface LoginDetails {
        email: string;
        password: string;
    }

    export interface CreateRequest extends LoginDetails {
        name: string;
    }

    export interface User extends CreateRequest, Base.Record{}
    
    export interface TokenResponse {
        token: string;
        expiresIn: string;
    }
}

