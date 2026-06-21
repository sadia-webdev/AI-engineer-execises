import OpenAI from "openai/index.js";
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs'
import { Buffer } from "buffer";


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const mp3 =  openai.audio.speech.create({
model: "gpt-4o-mini-tts",
voice: "coral",
input: "Hi, How are you",
instructions: "speak in a chearful and positive tone "
})


const buffer = Buffer.from(await mp3.arrayBuffer())
fs.writeFileSync("audio/gpt-4o-mini-tts.mp3", buffer)
console.log("file saved at /audio/gpt-4o-mini-tts.mp3 ")