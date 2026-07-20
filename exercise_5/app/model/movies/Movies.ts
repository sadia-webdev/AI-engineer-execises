import mongoose, { Schema, model, models } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    director: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Movie = models.Movie || model("Movie", movieSchema);
