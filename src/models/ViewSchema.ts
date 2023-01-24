import { model, ObjectId, Schema } from "mongoose";

interface viewSchemaType {
  userId: ObjectId;
  Ref: ObjectId;
  timestamp: string;
  current: string;
  createdAt: Date;
  updatedAt: Date;
  Scenes: { sceneid: string; ans: number }[];
}

const viewSchema = new Schema<viewSchemaType>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  Ref: {
    type: Schema.Types.ObjectId,
    Ref: "video",
  },
  current: { type: String },
  timestamp: { type: String },
  Scenes: [
    {
      type: Schema.Types.Mixed,
      no: { type: Number },
      sceneid: { type: Schema.Types.ObjectId },
    },
  ],
}, { timestamps: true }
);

const View = model<viewSchemaType>("history", viewSchema);
export default View;
