import { createUser, user } from "../modules/users/user.resolver"
import { login } from "../modules/auth/auth.resolver"
export const resolvers = {
    Query: {
        user
    },
    Mutation: {
        createUser,
        login
    }
}