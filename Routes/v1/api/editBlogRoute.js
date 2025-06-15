import express from 'express'
import { editBlogController } from '../../../controllers/blog/editBlog.controller.js'
const router = express.Router()

router.patch('/user/edit/:id',editBlogController)

export default router