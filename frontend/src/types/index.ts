export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
