import express from 'express'
import { PublishBlogController } from '../../../controllers/blog/publishBlog.controller.js'
const router = express.Router()


router.get('/publish/:blogId',PublishBlogController)

export default router
