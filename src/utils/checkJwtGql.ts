import { GraphQLError } from "graphql";
import { JwtPayload, verify } from "jsonwebtoken"
import { config } from "../core/config";

export const checkJwtGql = async (token: string): Promise<JwtPayload | string> => {
    const decoded: JwtPayload | string = await verify(token, config.jwtSecret);
    if(!decoded){
        throw new GraphQLError('Missing authentication', {
            extensions: { code: 'UNAUTHORIZED' },
        });
    }
        return decoded;
}