export interface RegisterUserData {
    fullName: string 
    email: string 
    password: string 
}

export interface NormalLogin {
    email: string 
    password: string
}

export interface TokenLogin {
    email: string
}

export interface VerifyToken {
    email: string
    token: string
}

export interface UpdateRole {
    role: string 
}

