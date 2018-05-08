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
  const dateCreated = new Date(Date.parse(this.dateCreated));
  const dateNow = new Date();
  const normalizedDateDiff = (dateNow.getTime() - dateCreated.getTime()) / (10 ** 8);

  const score = this.upvotes - this.downvotes;
  const hotScore = score * (1 / (normalizedDateDiff ** 2));
  return hotScore;
});

// create model class
const PostModel = mongoose.model('Post', PostSchema);

// create PostModel class from schema


export default PostModel;
