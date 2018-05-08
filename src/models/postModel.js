import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const PostSchema = new Schema(
  {
    title: String,
    tags: String,
    content: String,
    cover_url: String,
    contentType: String,
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    dateCreated: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

PostSchema.virtual('score').get(function scoreCalc() {
  return this.upvotes - this.downvotes;
});

PostSchema.virtual('hotScore').get(function scoreCalc() {
  return (this.upvotes - this.downvotes);
});

// create model class
const PostModel = mongoose.model('Post', PostSchema);

// create PostModel class from schema


export default PostModel;
