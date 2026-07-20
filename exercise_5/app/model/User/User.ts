import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
    },

    favorite_genre: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model("User", userSchema);
