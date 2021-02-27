export namespace Users {
    export interface User {
        id: string;
        name: string;
    }
    
    export interface CreateUserRequest {
        name: string;
        email: string;
        password: string;
    }

    export interface LoginDetails {
        email: string;
        password: string;
    }

    export interface TokenResponse {
        token: string;
        expiresIn: string;
    }
}

