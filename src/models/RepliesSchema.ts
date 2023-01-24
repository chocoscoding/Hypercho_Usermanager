import { model, Schema, ObjectId, Document } from "mongoose";
import { Comment, ReplyLike } from ".";
import logg from "../Logs/Customlog";

//types for replies schema
export interface repliesType extends Document {
  user: ObjectId;
  channel: ObjectId;
  commentRef: ObjectId;
  videoRef: ObjectId;
  text: string;
  likes: number;
  dislikes: number;
  creatorLove: boolean;
  createdAt: Date;
}

//replies schema
const repliesSchema = new Schema<repliesType>({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  channel: { type: Schema.Types.ObjectId, ref: "channel" },
  commentRef: { type: Schema.Types.ObjectId, required: true },
  videoRef: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  creatorLove: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

repliesSchema.post("findOneAndDelete", async (doc: repliesType, next: () => void) => {
  //if the document doesnt exist
  if (!doc) {
    return next();
  }

  //if the document exists
  const { _id, commentRef } = doc;
  try {
    //update the comment that has the document id of this reply in its array
    Comment.updateOne({ _id: commentRef }, { $pull: { replies: _id } });

    //delete all likes/dislikes related to that reply
    await ReplyLike.deleteMany({ Ref: doc._id });
  } catch (e: any) {
    logg.warn(e.message);
  }
  return next();
});
export default model<repliesType>("reply", repliesSchema);
