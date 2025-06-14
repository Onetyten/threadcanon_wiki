import express from 'express'
import { CreateBlogController } from '../../../controllers/blog/createBlog.controller.js'
const router = express.Router()


router.post('/create',CreateBlogController)

export default router