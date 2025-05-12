import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'

export interface MailContext {
  from?: string
  to: string
  subject: string
  data: { [key: string]: string | number | boolean }
}

export default class Mail {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }

  public envelop(context: MailContext): Pick<SendMailOptions, 'from' | 'to' | 'subject'> {
    return {
      from: context?.from || process.env.MAIL_FROM_ADDRESS,
      to: context.to,
      subject: context.subject
    }
  }

  public async content(template: string, context: MailContext): Promise<string> {
    const templatePath = path.join(__dirname, `../views/mail/${template}.ejs`)
    const templateContent = fs.readFileSync(templatePath, 'utf-8')
    return ejs.render(templateContent, context)
  }

  public attachments(): SendMailOptions['attachments'] {
    return []
  }

  public async send(template: string, context: MailContext): Promise<void> {
    const mailOptions: SendMailOptions = {
      ...this.envelop(context),
      html: await this.content(template, context),
      attachments: this.attachments()
    }

    await this.transporter.sendMail(mailOptions)
  }
}
