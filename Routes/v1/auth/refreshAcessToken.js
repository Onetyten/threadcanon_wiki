import express from "express"
const router = express.Router()
import { refreshTokenController } from "../../../controllers/refreshAccessToken.controller.js"


router.post('/refreshAccessToken',refreshTokenController)

export default router