import { Document, Schema, model } from "mongoose";
import { IRole, roleSchema } from "./roleModel"; // <-- Importa también el schema

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: IRole[];
  creationDate: Date;
  deleteDate?: Date;
  status: boolean;
  currency: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  role: {
    type: [roleSchema],
    required: true,
    validate: [
      {
        validator: (array: any[]) => array.length > 0,
        message: "El usuario debe identificarse con al menos un rol",
      },
    ],
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

export const User = model<IUser>("User", userSchema, "user");
