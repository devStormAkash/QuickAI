import express from 'express'
import { auth } from '../middlewares/auth.js'
import { getCreations, getPublishedCreations, toggleLikeCreation } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/get-user-creations', auth, getCreations)
userRouter.get('/get-published-creations', auth, getPublishedCreations)
userRouter.post('/toggle-liked-creations', auth, toggleLikeCreation)


export default userRouter