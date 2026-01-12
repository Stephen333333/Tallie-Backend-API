import mongoose, { Schema, Model } from 'mongoose';
import { Ireservation } from '@/types/reservation';

const reservationSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
    index: true,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'restaurantId id is required'],
    index: true,
  },
  tableId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'tableId id is required'],
    autopopulate: true,
    ref: 'Table',
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  partySize: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
    index: true,
  },
  endTime: {
    type: Date,
    required: true,
    index: true,
  },
}, { timestamps: true, }
);


reservationSchema.plugin(require('mongoose-autopopulate'));
export const Reservation: Model<Ireservation> = mongoose.model<Ireservation>('Reservation', reservationSchema);