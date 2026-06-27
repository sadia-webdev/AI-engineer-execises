import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline/promises";
import fs from "fs/promises";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const topic = await rl.question("Enter a topic for your blog article:");

rl.close();

const generateText = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical writer. Write clearly and professionally.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 100,
      stream: true,
    });

    let fullResponse = "";

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";

      if (content) {
        process.stdout.write(content);
        fullResponse += content;
      }
    }

    console.log("\n");
    return fullResponse;
  } catch (error) {
    console.error(`Text generation error: ${error.message}`);
    return null;
  }
};

console.log("\n=== ARTICLE ===\n");
const article = await generateText(`Create a blog article about ${topic}`);

console.log("\n=== SUMMARY ===\n");
const summary = await generateText(
  `Summarize this article in 2 sentences:\n${article}`,
);

console.log("\n=== social Post ===\n");
const socialPost = await generateText(
  `Create a LinkedIn post promoting this article:\n${article}`,
);

const saveToFile = async (filename, content) => {
  try {
    await fs.writeFile(filename, content);
    console.log(`Saved ${filename}`);
  } catch (error) {
    console.error(`Failed to save ${filename}:`, error.message);
  }
};

if (article) {
  await saveToFile("output/article.txt", article);
}

if (summary) {
  await saveToFile("output/summary.txt", summary);
}

if (socialPost) {
  await saveToFile("output/social-post.txt", socialPost);
}

const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "hd",
      response_format: "b64_json",
      style: "natural",
    });

    return response.data[0]?.b64_json || null;
  } catch (error) {
    console.error(`Image generation error: ${error.message}`);
    return null;
  }
};

const thumbnail = await generateImage(
  `
  Create a modern blog thumbnail.

Style:
- clean
- professional
- high quality
- no text
- vibrant colors
- suitable for a technology blog

Article:
${article}

  `,
);

if (!thumbnail) {
  console.log("Image generation failed");
  process.exit(1);
}

const image_base64 = thumbnail;
const image_bytes = Buffer.from(image_base64, "base64");

const filename = `images/${Date.now()}.png`;

if (thumbnail) {
  await saveToFile(`images/${filename}`, image_bytes);
}

console.log(`Image saved to /images/${filename}`);

const generateTextToSpeech = async (prompt) => {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: prompt,
      instructions: "speak in a chearful and positive tone ",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    if (buffer) {
      await saveToFile("audio/gpt-4o-mini-tts.mp3", buffer);
    }
    console.log("file saved at /audio/gpt-4o-mini-tts.mp3 ");

    return mp3;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

await generateTextToSpeech(article);



process.exit(0);