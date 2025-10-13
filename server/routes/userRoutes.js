import express from 'express'
import { auth } from '../middlewares/auth.js'
import { getCreations, getPublishedCreations, toggleLikeCreation } from '../controllers/userController.js'
import { generatePDF } from '../controllers/pdfGenerate.js'

const userRouter = express.Router()

userRouter.get('/get-user-creations', auth, getCreations)
userRouter.get('/get-published-creations', auth, getPublishedCreations)
userRouter.post('/toggle-liked-creations', auth, toggleLikeCreation)
userRouter.post('/generate-pdf' , auth , generatePDF)


export default userRouter