import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
// import fs from 'fs'
// // import pdf from 'pdf-parse/lib/pdf-parse.js';
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdf = require("pdf-parse");


const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;
    const free_usage = req.free_usage;
    const { prompt, length } = req.body;

    // Added return statement to stop execution
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Please Upgrade to Premium.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Error in generateArticle:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;
    const free_usage = req.free_usage;
    const { prompt} = req.body;

    // Added return statement to stop execution
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Please Upgrade to Premium.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Error in generateBlogTitle:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};








export const generateImages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;
    const { prompt, publish } = req.body;

    // Added return statement to stop execution
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Image generation is only available for premium users.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;
    
    // Uploading the image to cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(base64Image);
      console.log("Upload successful:", result.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
    await sql` INSERT INTO creations(user_id, prompt, content, type , publish) VALUES(${userId}, ${prompt}, ${
      result.secure_url
      }, 'image' , ${publish ?? false})`;
    
    res.json({ success: true, content: result.secure_url });
  } catch (error) {
    console.error("Error in generateImages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






export const removeBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;
    const image = req.file;

    // Added return statement to stop execution
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Image generation is only available for premium users.",
      });
    }


    // Uploading the image to cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(image.path, {
        transformation: [
          {
            effect: 'background_removal',
            background_removal : 'remove_the_background'
          }
        ]
      });
      console.log("Upload successful:", result.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, 'Remove the background from image', ${
      result.secure_url
    }, 'image' )`;

    res.json({ success: true, content: result.secure_url });
  } catch (error) {
    console.error("Error in removeBackground:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







export const removeObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;
    const image = req.file;
    const { object } = req.body;


    // Added return statement to stop execution
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Image generation is only available for premium users.",
      });
    }

    // Uploading the image to cloudinary
    const {public_id} = await cloudinary.uploader.upload(image.path);
    

    const imageUrl = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: 'image'
    });


    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image' )`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Error in removeObject:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};








export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;
    const resume = req.file;

    // Added return statement to stop execution
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Image generation is only available for premium users.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) return res.json({ success: false, message: "File size must be less that 5 MB" })
    
    const databuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(databuffer)
    const prompt = `Review the following resume and provide the constructive on its strength , weakness and areas for improvement. Resume content:\n\n${pdfData.text}`

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations(user_id, prompt, content, type) VALUES(${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;
   

    res.json({ success: true, content: content });
  } catch (error) {
    console.error("Error in reviewResume:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};