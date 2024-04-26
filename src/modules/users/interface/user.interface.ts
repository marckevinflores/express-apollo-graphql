export interface userCreateInput {
    name: string
    email: string
    password: string
    avatar: string
}

export interface CreateUserInput {
    dto: Pick<userCreateInput, "name" | "email" | "password">
}

export interface UpdateUserInput{
    id: string;
    dto: Pick<userCreateInput, "name" | "email" | "password" | "avatar"> 
}
export interface FindOneType {
    id?: string | number,
    email?: string
}

export interface UserInput {
    name: string
    email: string
    password: string
    avatar?: string
}