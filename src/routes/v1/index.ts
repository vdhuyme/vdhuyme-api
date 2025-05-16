import express from 'express'
import analytics from '@routes/v1/analytics'
import auth from '@routes/v1/auth'
import categories from '@routes/v1/categories'
import contacts from '@routes/v1/contacts'
import health from '@routes/v1/health'
import licenses from '@routes/v1/licenses'
import logs from '@routes/v1/logs'
import posts from '@routes/v1/posts'
import publicCategories from '@routes/v1/public.categories'
import publicPosts from '@routes/v1/public.posts'

const router = express.Router()

router.use('/analytics', analytics)
router.use('/auth', auth)
router.use('/categories', categories)
router.use('/contacts', contacts)
router.use('/health', health)
router.use('/licenses', licenses)
router.use('/logs', logs)
router.use('/posts', posts)
router.use('/public-categories', publicCategories)
router.use('/public-posts', publicPosts)

export default router
