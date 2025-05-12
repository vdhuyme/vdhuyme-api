import Mail, { MailContent, MailData } from '@config/mail'
import { SendMailOptions } from 'nodemailer'

export interface ContactMailData extends MailData {
  name: string
  email: string
  message: string
}

export default class ContactMail extends Mail {
  public data: ContactMailData

  constructor(data: ContactMailData) {
    super(data)
    this.data = data
  }

  public envelop(): Pick<SendMailOptions, 'from' | 'to' | 'subject'> {
    return {
      from: this.data.email,
      to: this.data.to,
      subject: this.data.subject || 'Contact Email'
    }
  }

  protected content(): MailContent {
    return {
      template: 'contact.mail',
      with: { data: this.data }
    }
  }
}
