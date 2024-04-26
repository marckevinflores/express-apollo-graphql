import { createUser, user, updateUser } from "../modules/users/user.resolver"
import { login, sendRecovery } from "../modules/auth/auth.resolver"
export const resolvers = {
    Query: {
        user
    },
    Mutation: {
        createUser,
        updateUser,
        login,
        sendRecovery
    }
}