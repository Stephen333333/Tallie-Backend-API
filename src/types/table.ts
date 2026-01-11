import { Types } from "mongoose";

export type Itable = {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  removed: Boolean;
  tableNumber: number;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
};
