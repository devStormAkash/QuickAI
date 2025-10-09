import express from 'express'
import { auth } from '../middlewares/auth.js'
import { generateArticle, generateBlogTitle, generateImages, removeBackground, removeObject, reviewResume } from '../controllers/aiController.js'
import { upload } from '../middlewares/multer.js'

const aiRouter = express.Router()

aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post("/generate-blog-title", auth, generateBlogTitle)
aiRouter.post("/generate-image", auth, generateImages)
aiRouter.post("/remove-image-background", upload.single('image'), auth, removeBackground);
aiRouter.post("/remove-image-object", upload.single('image'),auth, removeObject);
aiRouter.post("/review-resume", upload.single('resume'), auth, reviewResume);

export default aiRouter;

// import express from "express";
// import { requireAuth } from "@clerk/express";
// import { auth } from "../middlewares/auth.js";
// import { generateArticle } from "../controllers/aiController.js";

// const aiRouter = express.Router();

// // Apply requireAuth first, then custom auth middleware
// aiRouter.post("/generate-article", requireAuth(), auth, generateArticle);

// export default aiRouter;