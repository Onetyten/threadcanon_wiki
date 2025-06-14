import express from 'express'
import { CreateBlogController } from '../../../controllers/blog/createBlog.controller'
const router = express.Router()


router.post('create__blog',CreateBlogController)

export default router