import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";
import Joke from "../../model/Joke";
import { connectDB } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    system: `
    RULES:
- If the user asks for any joke, you MUST call fetchDadRandomJoke.
- Never answer with a joke from your own knowledge.
- Always use the tool.
    `,

    maxSteps: 5,

    tools: {
      fetchDadRandomJoke: tool({
        description:
          "Use this tool whenever the user asks for a dad joke, a random joke, or wants to hear a joke. Never generate a joke from your own knowledge.",
        inputSchema: z.object({
          category: z.enum(["dad"]),
        }),

        execute: async ({ category }) => {
          console.log("✅ Tool executed!", category);

          try {
            await connectDB();
            const res = await fetch("https://icanhazdadjoke.com", {
              headers: {
                Accept: "application/json",
              },
            });

            if (!res.ok) {
              const [local] = await Joke.aggregate([
                { $match: { category } },
                { $sample: { size: 1 } },
              ]);

              if (local) {
                return {
                  joke: local.joke,
                  category: local.category,
                };
              }

              return {
                error: "Couldn't fetch joke and no local jokes available.",
              };
            }

            const data = await res.json();

            const existing = await Joke.findOne({
              joke: data.joke,
            });

            if (!existing) {
              await Joke.create({
                joke: data.joke,
                category,
              });
            }

            console.log({
              joke: data.joke,
              category,
            });

            return {
              joke: data.joke,
              category,
            };
          } catch (error) {
            console.log(error);
            return {
              error: "Couldn't fetch joke ",
            };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
