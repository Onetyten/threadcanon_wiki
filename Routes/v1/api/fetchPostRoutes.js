import express from 'express'
import { FetchPostsController } from '../../../controllers/blog/fetchPosts.controller.js'
const router = express.Router()

router.get('/user/fetchposts',FetchPostsController)

export default router