import Mail from '@config/mail'
import { ContactMailData, MailContent } from 'interfaces'
import { SendMailOptions } from 'nodemailer'

export default class ContactMail extends Mail {
  public data: ContactMailData
  private toAddress: string

  constructor(data: ContactMailData) {
    super(data)
    this.data = data
    this.toAddress = process.env.MAIL_USER as string
  }

  public envelop(): Pick<SendMailOptions, 'from' | 'to' | 'subject'> {
    return {
      from: this.data.email,
      to: this.toAddress,
      subject: this.data.subject || 'Contact Email'
    }
  }

  protected content(): MailContent {
    return {
      template: 'contact.mail',
      with: {
        name: this.data.name,
        email: this.data.email,
        message: this.data.message
      }
    }
  }
}
