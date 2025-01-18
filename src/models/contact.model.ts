import mongoose, { Schema, Document, Types } from "mongoose";

export interface IContact extends Document {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  userId: Types.ObjectId;
  lockedBy?: Types.ObjectId;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  deletedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lockedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    lockedUntil: { type: Date, required: false, default: null },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
