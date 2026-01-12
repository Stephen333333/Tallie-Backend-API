import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const restaurantSchema = new Schema(
  {
    removed: {
      type: Boolean,
      default: false,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    website: {
      type: String,
      required: true,
      index: true,
    },
    openingHours: {
      required: true,
      type: Map,
      of: {
        openingTime: {
          type: Number,
          min: 0,
          max: 1439,
          required(): boolean {
            return !this.isClosed;
          },
        },
        closingTime: {
          type: Number,
          min: 0,
          max: 1439,
          required(): boolean {
            return !this.isClosed;
          },
        },
        isClosed: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

restaurantSchema.plugin(require("mongoose-autopopulate"));
export type IRestaurant = InferSchemaType<typeof restaurantSchema>;
export const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);
