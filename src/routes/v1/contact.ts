import { Contact, db } from '@config/database'
import ContactMail, { ContactMailData } from '@mail/contact.mail'
import { validate } from '@middlewares/validation'
import { sendContactRequest } from '@requests/send.contact.request'
import { id } from '@utils/id'
import { timestamp } from '@utils/timestamp'
import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/', validate(sendContactRequest), async (req: Request, res: Response) => {
  const { email, name, message } = req.body
  const contact = {
    id: id(),
    from: email,
    email,
    name,
    message,
    createdAt: timestamp(),
    updatedAt: timestamp()
  } satisfies Contact & ContactMailData

  const mail = new ContactMail(contact)
  await mail.send()
  db.data.contacts.push(contact)
  db.write()

  res.json({ message: 'success' })
})

export default router
