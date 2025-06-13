import express from 'express'


const router = express.Router()
import {signupController} from '../../../controllers/signup.controller.js'

router.post('/signup', signupController)

export default router