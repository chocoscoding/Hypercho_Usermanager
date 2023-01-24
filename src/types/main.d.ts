import { ObjectId, Document } from "mongoose";


export interface commentsType extends Document {
    user: ObjectId;
    channel: ObjectId;
    videoRef: ObjectId;
    text: string;
    likes: number;
    dislikes: number;
    creatorLove: boolean;
    createdAt: Date;
    replies: ObjectId[] | undefined[];
  }
    export interface ResultTypes {
        success: boolean;
        data?: any;
        code: number;
        error?: string;
        message?: string;
      }