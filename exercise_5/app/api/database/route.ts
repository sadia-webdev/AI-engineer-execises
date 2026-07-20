import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, tool } from "ai";
import { connectDB } from "../../lib/mongodb";
import { z } from "zod";
import { Movie } from "../../model/movies/Movies";
import { User } from "@/app/model/User/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),

      system: `
You are a database assistant.

You can perform these operations:

1. Fetch movies by genre or minimum rating.
2. Find users older than a specific age.
3. Count movies grouped by genre.

Choose the correct tool based on the user's request.
`,

      messages: await convertToModelMessages(messages),

      tools: {
        FetchMovies: tool({
          description:
            "Fetch movies by genre or find movies with a rating above a minimum rating.",

          inputSchema: z.object({
            genre: z.enum(["Sci-Fi", "Crime", "Drama", "Thriller"]).optional(),
            minRating: z.number().optional(),
          }),

          execute: async ({ genre, minRating }) => {
            try {
              const filter: Record<string, unknown> = {};

              if (genre) {
                filter.genre = genre;
              }

              if (minRating !== undefined) {
                filter.rating = {
                  $gt: minRating,
                };
              }

              const movies = await Movie.find(filter);

              return movies;
            } catch (error) {
              console.error("Something went wrong:", error);

              return {
                error: "Could not fetch movies",
              };
            }
          },
        }),

        FetchUsers: tool({
          description: "Find users by age",

          inputSchema: z.object({
            minAge: z.number().optional(),
          }),

          execute: async ({ minAge }) => {
            try {
              const filter: Record<string, unknown> = {};

              if (minAge !== undefined) {
                filter.age = {
                  $gt: minAge,
                };
              }

              const users = await User.find(filter);

              return users;
            } catch (error) {
              console.error("Something went wrong:", error);

              return {
                error: "Could not fetch users",
              };
            }
          },
        }),

        CountMoviesByGenre: tool({
          description: "Count the total number of movies in each genre.",

          inputSchema: z.object({}),

          execute: async () => {
            try {
              const result = await Movie.aggregate([
                {
                  $group: {
                    _id: "$genre",
                    total: {
                      $sum: 1,
                    },
                  },
                },
              ]);

              return result;
            } catch (error) {
              console.error("Could not count movies by genre:", error);

              return {
                error: "Could not count movies by genre",
              };
            }
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Database connection error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Could not connect to MongoDB",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
