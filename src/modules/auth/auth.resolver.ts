import { PrismaClient, User } from "@prisma/client";
import { LoginType } from "./types/auth.types";
import { GraphQLError } from "graphql";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../../core/config";


const prisma = new PrismaClient();
export async function login(
    _: unknown,
    args: LoginType
): Promise<{user: User, token: string}>{
    const { email, password} = args;
    const user = await prisma.user.findFirst({
        where: {email}
    })
    if(!user){
        throw new GraphQLError('username or password is incorrect', {
            extensions: { code: 'UNAUTHORIZED' },
        });
    }
    const match = await compare(password, user.password);
    if(!match){
        throw new GraphQLError('username or password is incorrect', {
            extensions: { code: 'UNAUTHORIZED' },
        });
    }
    const payload = {
        sub: user.id,
        email: user.email
    }
    const token = sign(payload, config.jwtSecret);
    return { user, token}
}