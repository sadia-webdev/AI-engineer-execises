import mongoose from "mongoose";

const JokeSchema = new mongoose.Schema(
  {
    joke: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["dad", "programming", "general"],
      default: "dad",
    },

    source: {
      type: String,
      default: "icanhazdadjoke",
    },

    rating: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    dislikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Joke || mongoose.model("Joke", JokeSchema);
