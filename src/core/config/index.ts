import {config as globalConf} from 'dotenv';
globalConf();
export const config = {
    jwtSecret: process.env.JWT_SECRET as string
}