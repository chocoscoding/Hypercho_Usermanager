import { model, Schema, ObjectId, Document } from "mongoose";
import { CommentLike, Reply, ReplyLike } from ".";
import logg from "../Logs/Customlog";
import { commentsType } from "../types/main";

//comment schema
const commentSchema = new Schema<commentsType>({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  channel: { type: Schema.Types.ObjectId, ref: "channel" },
  videoRef: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  creatorLove: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "reply",
    },
  ],
});

commentSchema.post("findOneAndDelete", async (doc: commentsType, next: () => void) => {
  //if the document doesnt exist
  if (!doc) {
    return next();
  }

  //if the document exists
  const replies = doc.replies;
  try {
    //delete all replies associated with that comment
    await Reply.deleteMany({ _id: { $in: replies } });
    //delete all like associated with that comment
    await CommentLike.deleteMany({ Ref: doc._id });
    //delete all reply like associated with that comment
    await ReplyLike.deleteMany({ Ref: { $in: replies } });
  } catch (e: any) {
    logg.warn(e.message);
  }
  return next();
});

export default model<commentsType>("comment", commentSchema);
