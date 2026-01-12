import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const restaurantSchema = new Schema({
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
    type: Map,
    of: {
      openingTime: { type: Number, required: true },
      closingTime: { type: Number, required: true }
    }
  },
}, { timestamps: true, }
);

restaurantSchema.plugin(require('mongoose-autopopulate'));
export type IRestaurant = InferSchemaType<typeof restaurantSchema>;
export const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);