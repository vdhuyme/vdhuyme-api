import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'
import path from 'path'
import fs from 'fs'
import ejs from 'ejs'

export interface MailContext {
  [key: string]: string | number | boolean | object
}

export interface MailContent {
  template: string
  with: MailContext
}

export interface MailData {
  cc?: string
  bcc?: string
  from?: string
  to?: string
  subject?: string
}

export default abstract class Mail {
  public data: MailData
  private transporter: Transporter
  private mailFromAddress: string

  constructor(data: MailData) {
    this.data = data
    const { MAIL_SERVICE, MAIL_USER, MAIL_PASSWORD, MAIL_FROM_ADDRESS } = process.env
    this.mailFromAddress = MAIL_FROM_ADDRESS as string
    this.transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
      }
    })
  }

  protected abstract content(): MailContent

  protected envelop(): Pick<SendMailOptions, 'from' | 'to' | 'subject'> {
    return {
      from: this.data.from || this.mailFromAddress,
      to: this.data.to,
      subject: this.data.subject
    }
  }

  protected attachments(): SendMailOptions['attachments'] {
    return []
  }

  private renderContent({ template, with: context }: MailContent): string {
    const templatePath = path.join(__dirname, `../views/mail/${template}.ejs`)
    const templateContent = fs.readFileSync(templatePath, 'utf-8')
    return ejs.render(templateContent, context)
  }

  public async send(): Promise<void> {
    const mailContent = this.content()
    const mailOptions: SendMailOptions = {
      ...this.envelop(),
      html: this.renderContent(mailContent),
      attachments: this.attachments()
    }

    await this.transporter.sendMail(mailOptions)
  }
}
