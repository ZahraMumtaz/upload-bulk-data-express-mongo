import TimePerSlot, { TimePerSlotDocument } from "../models/timePerSlot.model";
import { getEndTime, getStartTime } from "../utils/timeSlot";

export interface ScreenshotInput {
  id: string;
  localURL: string;
  liveURL: string;
  name: string;
  displayId: string;
  capturedAt: Date;
}

const createScreenshotSlot = (
  slotSize: number,
  startTime: any,
  screenshot: any
) => {
  let timeSlot: any = {
    mouseClicks: Array(slotSize).fill(0),
    keystrokes: Array(slotSize).fill(0),
    totalTime: 0,
    onlineTime: 0,
    offlineTime: 0,
    productiveTime: 0,
    offlineReason: "",
    captureStartTime: getStartTime(slotSize * 60000, new Date(startTime)),
    captureEndTime: getEndTime(
      slotSize * 60000,
      new Date(screenshot[0].capturedAt)
    ),
    userId: "638f1e3f555e42102ec04e81",
    companyId: "638f1e3f555e42102ec04e71",
    screenshots: screenshot,
  };
  return timeSlot;
};

const groupScreenshotsData = (
  screenshots: ScreenshotInput[],
  slotSize: number,
  screenshotSlots: any
) => {
  if (screenshots.length > 0) {
    screenshots.forEach((screenshot) => {
      let screenshotTime = new Date(screenshot.capturedAt);
      const startTime = getStartTime(
        slotSize * 60000,
        screenshotTime
      ).toISOString();
      screenshotSlots[startTime] = screenshotSlots[startTime] || [];
      screenshotSlots[startTime].push(screenshot);
    });
  }
  return screenshotSlots;
};

const getTimeSlotData = async (
  captureStartTime: string[]
): Promise<TimePerSlotDocument[]> => {
  return await TimePerSlot.find({
    captureStartTime: { $in: captureStartTime },
  });
};

const groupDbTimeSlots = async (captureStartTime: string[]) => {
  let timeSlots: any = [];
  let dbSlots: TimePerSlotDocument[] = await getTimeSlotData(captureStartTime);
  if (dbSlots.length > 0) {
    dbSlots.forEach((slot) => {
      let captureTime = slot.captureStartTime.toISOString();
      timeSlots[captureTime] = timeSlots[captureTime] || [];
      timeSlots[captureTime].push(slot);
    });
  }
  return timeSlots;
};

export default {
  getTimeSlotData,
  groupDbTimeSlots,
  groupScreenshotsData,
  createScreenshotSlot,
};
