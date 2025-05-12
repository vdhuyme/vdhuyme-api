import Mail, { MailData } from '@config/mail'

export default class ContactMail extends Mail {
  constructor(mailData: MailData) {
    super(mailData)
  }
}
