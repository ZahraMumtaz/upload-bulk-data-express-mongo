import mongoose, { Schema } from "mongoose";
import Screenshot, { ScreenshotDocument } from "./screenshots.model";

export interface TimePerSlotDocument extends mongoose.Document {
  mouseClicks: number[];
  keystrokes: number[];
  totalTime: number;
  onlineTime: number;
  offlineTime: number;
  productiveTime: number;
  offlineReason: string;
  companyId: string;
  userId: string;
  screenshots: [];
  captureStartTime: Date;
  captureEndTime: Date;
  captureDuration: number;
}

const TimePerSlotSchema = new Schema(
  {
    mouseClicks: [Number],
    keystrokes: [Number],
    totalTime: Number,
    onlineTime: Number,
    offlineTime: Number,
    productiveTime: Number,
    offlineReason: String,
    companyId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    screenshots: [Screenshot],
    captureStartTime: Date,
    captureEndTime: Date,
    captureDuration: { type: Number, default: 10 },
  },
  { timestamps: true, collection: "timePerSlots" }
);

const TimePerSlot = mongoose.model<TimePerSlotDocument>(
  "TimePerSlot",
  TimePerSlotSchema
);
export default TimePerSlot;
