import express from 'express'
import { FetchOneBlogController } from '../../../controllers/blog/fetchOneBlog.controller.js'
const router = express.Router()

router.get('/:id',FetchOneBlogController)

export default router