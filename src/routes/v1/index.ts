import express from 'express'
import post from '@routes/v1/post'
import publicPost from '@routes/v1/public.post'
import license from '@routes/v1/license'
import auth from '@routes/v1/auth'

const router = express.Router()

router.use('/post', post)
router.use('/public-post', publicPost)
router.use('/license', license)
router.use('/auth', auth)

export default router
