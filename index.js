import OpenAI from "openai";
import dotenv from "dotenv";
import readline from "readline/promises";
dotenv.config();


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const topic = await rl.question(" Enter a topic for your blog post: ");


const generateBlog = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{role: "user", content: prompt}],
        max_completion_tokens: 100,
        stream: true
    })
  

    let fullResponse = ""

    for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ""
        if(content){
            process.stdout.write(content)
        fullResponse += content
        }
    }
    console.log("\n");

    return fullResponse
}

const outline = await generateBlog(
    `Create a blog post outline about ${topic}`
  );

  console.log(outline, "\n")


const summarizer = async (text) => {
    const response = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{role: "user", content: text}],
        max_completion_tokens: 50,
    })

    return response.choices[0].message.content
}

const summary = await summarizer(
    `Summarize this outline in 2 sentences:\n${outline}`
);
  
  console.log(summary, "\n");



  const askQuestion = async (topic, question) => {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `You are a helpful content assistant. Answer questions about ${topic}.`
        },
        {
          role: "user",
          content: question
        }
      ]
    });
  
    return response.choices[0].message.content;
  };


  while (true) {
    const question = await rl.question(
      "\n❓ Ask a follow-up question (or type 'exit'): "
    );
  
    if (question.toLowerCase() === "exit") {
      break;
    }
  
    const answer = await askQuestion(topic, question);
  
    console.log("\n🤖", answer);
  }


  rl.close();

  
