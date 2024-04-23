import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import { GraphQLError } from "graphql";
import gravatar from 'gravatar'
import { checkJwtGql } from "../../utils/checkJwtGql";
import { Context } from "../../core/types/core.types";
import { JwtPayload } from "jsonwebtoken";

interface UserInput {
    name: string,
    email: string,
    password: string
}


const prisma = new PrismaClient();
export async function createUser(
    _: unknown,
    { input: { name, email, password} }: {input: UserInput}
): Promise<User>{
    const isExists = await prisma.user.findFirst({
        where: { email }
    })
    if (isExists) {
        throw new GraphQLError('email is already exists', {
            extensions: { code: 'USER_ALREADY_EXISTS' },
        });
    }
    const hashPassword = await hash(password, 10);
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    })
    const user = await prisma.user.create(
        {
            data: {
                name,
                email,
                password: hashPassword,
                avatar
            }
        }
    )
    return user;
}
export async function user(_root: unknown, _: unknown, context: Context): Promise<User | null> {
    try {
        const result = await checkJwtGql(context.token) as JwtPayload;
        if (result) {
            const foundUser = await prisma.user.findFirst({
                where: { id: result.sub }
            });
            return foundUser;
        } else {
            throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED' }
            });
        }
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching user:', error);
        throw new GraphQLError('Internal Server Error', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}