import { model, Schema, ObjectId, Document } from "mongoose";

//types for channel schema
interface ChannelSchemaType {
  Subscribers: number;
  username: string;
}
//channel shema
const ChannelSchema = new Schema<ChannelSchemaType>({
  username: {
    type: String,
  },
  Subscribers: {
    type: Number,
    required: true,
  },
});

export default model<ChannelSchemaType>("channel", ChannelSchema);
