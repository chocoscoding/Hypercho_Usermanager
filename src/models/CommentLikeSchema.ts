import { model, Schema, ObjectId, Document } from "mongoose";

//types for likes schema
interface likesSchemaType {
  userId: ObjectId;
  Ref: ObjectId;
  videoRef: ObjectId;
  type: boolean;
}

//likes schema
const likesSchema = new Schema<likesSchemaType>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    Ref: { type: Schema.Types.ObjectId, required: true, index: true },
    videoRef: { type: Schema.Types.ObjectId, required: true, index: true },
    type: { type: Boolean, required: true },
  },
  { timestamps: true, _id: false }
);

export default model<likesSchemaType>("commentlike", likesSchema);
