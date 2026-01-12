import { Types } from "mongoose";

export type Irestaurant = {
  _id: Types.ObjectId;
  removed: boolean;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: Map<string, { openingTime: Number; closingTime: Number }>;
  createdAt: Date;
  updatedAt: Date;
};
