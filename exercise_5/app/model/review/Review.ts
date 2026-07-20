import  mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  movie_id: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },

  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },

  comment: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
