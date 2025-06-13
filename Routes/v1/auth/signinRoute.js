import express from 'express'


const router = express.Router()
import {signInController} from '../../../controllers/signin.controller.js'

router.post('/signin', signInController)
export default router