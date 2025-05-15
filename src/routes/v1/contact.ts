import { Contact } from '@entities/contact'
import BadRequestException from '@exceptions/bad.request.exception'
import ContactMail from '@mail/contact.mail'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import SendContactRequest from '@requests/send.contact.request'
import UpdateContactStatusRequest from '@requests/update.contact.status.request'
import { OK } from '@utils/http.status.code'
import { db } from 'data-source'
import express, { NextFunction, Request, Response } from 'express'

const router = express.Router()

router.get('/', auth(), async (req: Request, res: Response) => {
  const contacts = await db.getRepository<Contact>(Contact).find({ order: { createdAt: 'DESC' } })

  res.status(OK).json({ contacts })
})

router.patch(
  '/:id',
  auth(),
  validate(UpdateContactStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { status } = req.body as UpdateContactStatusRequest

    const contactRepository = db.getRepository<Contact>(Contact)
    const contact = await contactRepository.findOneBy({ id })
    if (!contact) {
      return next(new BadRequestException(`Not found contact: ${id}`))
    }
    contact.status = status
    await contactRepository.save(contact)

    res.status(OK).json({ message: 'success' })
  }
)

router.post('/', validate(SendContactRequest), async (req: Request, res: Response) => {
  const { email, name, message } = req.body as SendContactRequest

  const contactRepository = db.getRepository<Contact>(Contact)
  const contact = contactRepository.create({
    email,
    name,
    message
  })
  const mail = new ContactMail(contact)
  await mail.send()
  await contactRepository.save(contact)

  res.json({ message: 'success' })
})

export default router
