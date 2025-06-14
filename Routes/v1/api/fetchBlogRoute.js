import express from 'express'
import { FetchBlogController } from '../../../controllers/blog/fetchBlog.controller.js'
export const router = express.Router()


router.get('/fetch',FetchBlogController)
export default router
