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

export interface ContactMailData extends MailData {
  name: string
  email: string
  message: string
}
