import { Document, Schema, model } from "mongoose";

export interface ICategory extends Document {
  _id: string;
  name: string;
  description: string;
  creationDate: Date;
  deleteDate?: Date;
  status: boolean;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  deleteDate: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export const Category = model<ICategory>("Category", categorySchema, "category");
