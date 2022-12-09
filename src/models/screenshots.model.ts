import mongoose, { Schema } from "mongoose";

export interface ScreenshotDocument extends mongoose.Document {
  id: string;
  localURL: string;
  liveURL: string;
  name: string;
  displayId: string;
  dimensions: string;
  capturedAt: Date;
}

const Screenshot = new Schema({
  id: String,
  localURL: String,
  liveURL: String,
  name: String,
  displayId: String,
  dimensions: String,
  capturedAt: {
    type: Date,
  },
});

export default Screenshot;
