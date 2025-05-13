import express from 'express'
import auth from '@routes/v1/auth'
import contact from '@routes/v1/contact'
import license from '@routes/v1/license'
import log from '@routes/v1/log'
import post from '@routes/v1/post'
import publicPost from '@routes/v1/public.post'

const router = express.Router()

router.use('/auth', auth)
router.use('/contacts', contact)
router.use('/licenses', license)
router.use('/logs', log)
router.use('/posts', post)
router.use('/public-posts', publicPost)

export default router
