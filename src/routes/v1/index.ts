import express from 'express'
import analytics from '@routes/v1/analytics'
import auth from '@routes/v1/auth'
import categories from '@routes/v1/categories'
import health from '@routes/v1/health'
import logs from '@routes/v1/logs'
import posts from '@routes/v1/posts'
import settings from '@routes/v1/settings'
import tags from '@routes/v1/tags'
import publishedCategories from '@routes/v1/published.categories'
import publishedPosts from '@routes/v1/published.posts'
import publishedTags from '@routes/v1/published.tags'

const router = express.Router()

router.use('/analytics', analytics)
router.use('/auth', auth)
router.use('/categories', categories)
router.use('/health', health)
router.use('/logs', logs)
router.use('/posts', posts)
router.use('/settings', settings)
router.use('/tags', tags)
router.use('/published-categories', publishedCategories)
router.use('/published-posts', publishedPosts)
router.use('/published-tags', publishedTags)

export default router
