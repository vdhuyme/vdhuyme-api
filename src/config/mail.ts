import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'

export interface MailData {
  cc?: string
  bcc?: string
  from?: string
  to: string
  subject: string
  data: MailContext
}

export interface MailContext {
  [key: string]: string | number | boolean | object
}

export default class Mail {
  public data: MailData
  private transporter: Transporter

  constructor(data: MailData) {
    this.data = data
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }

  public envelop(): Pick<SendMailOptions, 'from' | 'to' | 'subject'> {
    return {
      from: this.data?.from || process.env.MAIL_FROM_ADDRESS,
      to: this.data.to,
      subject: this.data.subject
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
      ...this.envelop(),
      html: await this.content(template, context),
      attachments: this.attachments()
    }

    await this.transporter.sendMail(mailOptions)
  }
}
