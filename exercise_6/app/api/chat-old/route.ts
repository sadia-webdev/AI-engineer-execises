import { google } from "@ai-sdk/google";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  tool,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),

    system: `
You are a helpful assistant.

You can:
- Answer general questions
- Use tools when relevant (weather, temperature conversion)

Only use tools when needed.
Keep responses short (max 3 sentences).
`,
    stopWhen: stepCountIs(5),

    tools: {
      weather: tool({
        description: "get the weather from the location",
        inputSchema: z.object({
          location: z.string().describe("the location to get the weather for"),
        }),

        execute: async ({ location }) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`,
          );

          if (!response.ok) {
            return {
              error: `Couldn't find weather for ${location}.`,
            };
          }

          const data = await response.json();

          return {
            location,
            temperature: data.main.temp,
          };
        },
      }),

      convertKelvinToCelsius: tool({
        description: "convert temperature from Kelvin to Celsius",
        inputSchema: z.object({
          kelvin: z.number().describe("temperature in Kelvin"),
        }),

        execute: async ({ kelvin }) => {
          const celsius = kelvin - 273.15;

          return {
            kelvin,
            celsius,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
