import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import { GraphQLError } from "graphql";
import gravatar from 'gravatar'
import { checkJwtGql } from "../../utils/checkJwtGql";
import { Context } from "../../core/types/core.types";
import { JwtPayload } from "jsonwebtoken";
import { UserInput } from "./interface/user.interface";
import { config } from "../../core/config";

const prisma = new PrismaClient();
export const createUser = async (
    _: unknown,
    { input: { name, email, password} }: {input: UserInput}
): Promise<User> => {
    const isExists = await prisma.user.findFirst({
        where: { email }
    })
    if (isExists) {
        throw new GraphQLError('Email is already exists', {
            extensions: { code: 'USER_ALREADY_EXISTS' },
        });
    }
    const hashPassword = await hash(password, config.passwordSalt);
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
export const updateUser = async (_: unknown,  { input }: {input: UserInput}, context: Context): Promise<User | undefined> => {
        try {
            const result = await checkJwtGql(context.token) as JwtPayload;
            if(result){
                const foundUser = await prisma.user.findFirst({
                    where: { id: result.sub }
                });
                if(foundUser){
                    let newPassword: string = foundUser.password;
                    if(input.password){
                        newPassword = await hash(input.password, 10);
                    }
                    const updateUser = await prisma.user.update({
                        where: { id: result.sub },
                        data: {
                            name: input.name ?? foundUser?.name,
                            email: input.email ?? foundUser?.email,
                            avatar: input.avatar ?? foundUser?.avatar,
                            password: newPassword,
                        }
                    })
                    return updateUser
                }
            }else{
                throw new GraphQLError('Unauthorized', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            
        }catch(error){
            throw new GraphQLError('Internal Server Error', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
            });
        }
}
export const user = async (_root: unknown, _: unknown, context: Context): Promise<User | null> => {
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
        throw new GraphQLError('Internal Server Error', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
}