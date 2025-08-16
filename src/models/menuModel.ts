import mongoose, { Schema, Document, model } from "mongoose";
import { IRole } from "./roleModel";

export interface IMenu extends Document {
  title: string;
  path: string;
  icon: string;
  description: string;
  roles: IRole[];
  status: boolean;
}

const roleSchema = new Schema<IRole>(
  {
    type: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const menuSchema = new Schema<IMenu>({
  title: { type: String, required: true },
  path: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  roles: {
    type: [roleSchema],
    required: true,
    validate: [
      {
        validator: (array: any[]) => array.length > 0,
        message: "El menú debe tener al menos un rol asignado",
      },
    ],
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

export const Menu = model<IMenu>("Menu", menuSchema, "menu");
