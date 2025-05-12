import { validate } from '@middlewares/validation'
import { sendMailRequest } from '@requests/send.mail.request'
import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/:template', validate(sendMailRequest), async (req: Request, res: Response) => {
  const data = req.body
})

export default router
