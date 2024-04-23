import { PrismaClient } from "@prisma/client";
import { hash } from 'bcrypt'

export async function createUsers(prismaClient: PrismaClient){
    const password = 'abc123'
    const hashpass  = await hash(password, 10);
    await prismaClient.user.upsert({
        where: {
            email: 'marckevinflores@gmail.com'
        },
        update: {},
        create: {
            name: 'Marc Kevin Flores',
            email: 'marckevinflores@gmail.com',
            password: hashpass,
            avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJyR3JYuj10SziS_eDjTWeum06mdRKXaJAi4ttDbQGzK9o7fDg4=s288-c-no'
        },
    })
}