import { PrismaClient, User } from "@prisma/client";
import { LoginType, MailType } from "./types/auth.types";
import { GraphQLError } from "graphql";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../../core/config";
import { createTransport } from 'nodemailer';
import fs from 'fs'
import path from "path";
const prisma = new PrismaClient();
export const login = async (
    _: unknown,
    args: LoginType
): Promise<{user: User, token: string}> => {
    const { email, password} = args;
    const user = await prisma.user.findFirst({
        where: {email}
    })
    if (!user || !(await compare(password, user.password))) {
        throw new GraphQLError("Username or password is incorrect", {
            extensions: { code: "UNAUTHORIZED" }
        });
    }
    
    const payload = {
        sub: user.id,
        email: user.email
    }
    const token = sign(payload, config.jwtSecret);
    return { user, token}
}
export const sendRecovery = async (_: unknown, args: {email: string}): Promise<string> => {
    const user = await prisma.user.findFirst({
        where: {email: args.email}
    })
    if(!user){
        throw new GraphQLError('Email is not found', {
            extensions: { code: 'NOT_FOUND' }
        });
    }
    const payload = { sub: user.id }
    const token = sign(payload, config.jwtSecret, {expiresIn: '15min'});
    const link = `http://localhost:${config.port}/recovery?token=${token}`
    const templatePath = path.join(__dirname, 'templates', 'reset_password_email_template.html');
    const htmlTemplate = fs.readFileSync(templatePath,  'utf8');
    const filledTemplate = htmlTemplate
    .replace('{{name}}', user.name)
    .replace('{{link}}', link);

    const mail: MailType = {
        from: config.smtpEmail,
        to: `${user.email}`,
        subject: "Reset Password",
        html: filledTemplate
    }
    const rta = await sendMail(mail);
    return rta;
}
const sendMail = async (infoMail: MailType): Promise<string> => {
    const mailOptions = {
      host: config.smtpHost,
      secure: false,
      port: config.smtpPort,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword,
      }
    }
    const transporter = createTransport(mailOptions);
    await transporter.sendMail(infoMail);
    return 'Mail Succesfully Sent';
}