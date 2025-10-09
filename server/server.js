import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()
await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is Live'))
app.use(requireAuth());
app.use('/api/ai', aiRouter)
app.use('/api/users' , userRouter)



const PORT = process.env.PORT || 8000

app.listen(PORT,  () => {
  console.log('Server is running on port ', PORT);
  
})

// import express from "express"; // Fixed typo: exppress -> express
// import cors from "cors";
// import "dotenv/config";
// import { clerkMiddleware } from "@clerk/express";
// import aiRouter from "./routes/aiRoutes.js";

// const app = express(); // Fixed typo here too

// app.use(cors());
// app.use(express.json()); // Fixed typo
// app.use(clerkMiddleware());

// // This route is now accessible without authentication
// app.get("/", (req, res) => res.send("Server is Live"));

// // Apply requireAuth only to the /api/ai routes through the router
// app.use("/api/ai", aiRouter);

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log("Server is running on port ", PORT);
// });