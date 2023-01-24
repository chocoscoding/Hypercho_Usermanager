import { model, Schema, ObjectId, Document } from "mongoose";
//types for video schema
export interface VideoType {
  likes: number;
  dislikes: number;
  Views: number;
  channelId: ObjectId;
}
//video schema
const videoSchema = new Schema<VideoType>({
  dislikes: { type: Number },
  likes: { type: Number },
  Views: { type: Number },
  channelId: {ref: 'channel', type: Schema.Types.ObjectId}
});

export default model<VideoType>("video", videoSchema);