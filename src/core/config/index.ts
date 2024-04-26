import {config as globalConf} from 'dotenv';
globalConf();
export const config = {
    port: process.env.PORT as string,
    jwtSecret: process.env.JWT_SECRET as string,
    smtpEmail: process.env.SMTP_EMAIL as string,
    smtpPassword: process.env.SMTP_PASSWORD as string,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
    smtpHost: process.env.SMTP_HOST as string
}