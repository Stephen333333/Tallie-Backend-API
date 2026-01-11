import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const tableSchema = new Schema(
  {
    removed: {
      type: Boolean,
      default: false,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "restaurantId id is required"],
      index: true,
    },
    tableNumber: {
      type: Number,
      required: [true, "tableNumber is required"],
      index: true,
    },
    capacity: {
      type: Number,
      required: [true, "capacity is required"],
      index: true,
    },
  },
  { timestamps: true }
);

tableSchema.plugin(require("mongoose-autopopulate"));
export type ITable = InferSchemaType<typeof tableSchema>;
export const Table: Model<ITable> = mongoose.model<ITable>(
  "Table",
  tableSchema
);
