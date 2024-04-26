export type LoginType = {
    email: string,
    password: string
  }
export interface MailType {
    from: string | undefined,
    to: string | undefined,
    subject: string | undefined,
    html: string | undefined,
}