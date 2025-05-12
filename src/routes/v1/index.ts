import express from 'express'
import auth from '@routes/v1/auth'
import contact from '@routes/v1/contact'
import license from '@routes/v1/license'
import post from '@routes/v1/post'
import publicPost from '@routes/v1/public.post'

const router = express.Router()

router.use('/auth', auth)
router.use('/contact', contact)
router.use('/license', license)
router.use('/post', post)
router.use('/public-post', publicPost)

export default router
