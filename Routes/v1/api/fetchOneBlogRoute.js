import express from 'express'
import { FetchOneBlogController } from '../../../controllers/blog/fetchOneBlog.controller.js'
const router = express.Router()

router.get('fetchone/:id',FetchOneBlogController)

export default router