import { Contact, db } from '@config/database'
import BaseStatusEnum from '@enums/base.status.enum'
import BadRequestException from '@exceptions/bad.request.exception'
import InternalServerErrorException from '@exceptions/internal.server.error.exception'
import ContactMail, { ContactMailData } from '@mail/contact.mail'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import { sendContactRequest } from '@requests/send.contact.request'
import { updateContactStatusRequest } from '@requests/update.contact.status.request'
import { OK } from '@utils/http.status.code'
import { id } from '@utils/id'
import { timestamp } from '@utils/timestamp'
import express, { NextFunction, Request, Response } from 'express'

const router = express.Router()

router.get('/', auth(), (req: Request, res: Response) => {
  const contacts = db.data.contacts
  res.status(OK).json({ contacts })
})

router.patch(
  '/:id',
  auth(),
  validate(updateContactStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { status } = req.body
    const contact = db.data.contacts.find((contact) => contact.id === id)
    if (!contact) {
      return next(new BadRequestException(`Not found contact: ${id}`))
    }

    contact.status = status
    contact.updatedAt = timestamp()
    await db.write()
    res.status(OK).json({ message: 'success' })
  }
)

router.post(
  '/',
  validate(sendContactRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, message } = req.body
    const contact = {
      id: id(),
      from: email as string,
      email,
      name,
      message,
      status: BaseStatusEnum.PENDING,
      createdAt: timestamp(),
      updatedAt: timestamp()
    } satisfies Contact & ContactMailData

    try {
      const mail = new ContactMail(contact)
      await mail.send()
    } catch (error: any) {
      next(new InternalServerErrorException(error.message))
    }

    db.data.contacts.push(contact)
    db.write()

    res.json({ message: 'success' })
  }
)

export default router
