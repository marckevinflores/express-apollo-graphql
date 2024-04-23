import { PrismaClient } from "@prisma/client";
import { createUsers } from "./seeder/user.seeder";

const prisma = new PrismaClient();
async function main() {
    await createUsers(prisma);
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })