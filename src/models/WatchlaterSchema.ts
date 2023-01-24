import { model, ObjectId, Schema } from "mongoose";

interface viewSchemaType {
  userId: ObjectId;
  Ref: ObjectId;
}

const viewSchema = new Schema<viewSchemaType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Ref: {
      type: Schema.Types.ObjectId,
      Ref: "video",
      required: true,
    },
  },
  { timestamps: true }
);

const View = model<viewSchemaType>("watchlater", viewSchema);
export default View;
