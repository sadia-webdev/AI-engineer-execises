import OpenAI from "openai/index.js";
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs'
import { Buffer } from "buffer";


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


const prompt = "A man wearing a suit"


const result = await openai.images.generate({
  model: "gpt-image-2-2026-04-21",
  prompt,
  size: "1024x1024",
  quality: 'hd',
  response_format: 'b64_json',
  style: "natural"
})


if(!fs.existsSync("images")){
   fs.mkdirSync("images")
}


const image_base64  = result.data[0]?.b64_json
const image_bytes = Buffer.from(image_base64, 'base64')


fs.writeFileSync('images/output.png', image_bytes)


console.log("Image saved to /images/output.png")