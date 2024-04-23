import { Context } from "../../core/types/core.types";

export const findOne = async (_: unknown, { id }: {id: string }, context: Context) => {
     return await context.prisma.user.findFirst({ where: {id} });
}