import express from 'express'
import { deleteBlogController } from '../../../controllers/blog/deleteBlog.controller.js'

const router = express.Router()

router.delete('/user/delete/:id',deleteBlogController)

export default router