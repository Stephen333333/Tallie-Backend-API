import { Types } from "mongoose";

export type Ireservation = {
  _id: Types.ObjectId;
  removed: boolean;
  restaurantId: Types.ObjectId;
  tableId: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
};
