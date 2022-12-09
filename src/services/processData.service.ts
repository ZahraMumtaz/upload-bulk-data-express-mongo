import TimePerSlot, { TimePerSlotDocument } from "../models/timePerSlot.model";
import { getEndTime, getStartTime } from "../utils/timeSlot";
import TimeSlotService, { ScreenshotInput } from "./timeSlot.service";

export interface MinutePulseInput {
  id: string;
  minuteTime: string;
  clicks: number;
  keystrokes: number;
  isActive: boolean;
  isSynced: boolean;
  idleTime: boolean;
}

const processAndUploadData = async (
  minutePulses: [MinutePulseInput],
  slotSize: number,
  screenshots: ScreenshotInput[]
) => {
  let minutePulseSlots: any = [];
  let screenshotSlots: any = [];
  let payloadData: any = [];

  let screenshotData = TimeSlotService.groupScreenshotsData(
    screenshots,
    slotSize,
    screenshotSlots
  );

  let minutePulseData = groupMinutePulseData(
    minutePulses,
    slotSize,
    minutePulseSlots
  );

  createScreenshotSlots(screenshotData, slotSize, payloadData);
  createAndUpdateMinutePulseSlot(minutePulseData, slotSize, payloadData);
  let bulkInsertObject = prepareBulkInsertPayload(payloadData);

  let queryResult = await TimePerSlot.bulkWrite(bulkInsertObject);

  console.log("Query executed");
  console.log(queryResult);
};

const prepareBulkInsertPayload = (payload: any) => {
  let bulkInsertObject: any = [];
  Object.keys(payload).forEach((value: any) => {
    let timeSot = payload[value][0];

    const { keystrokes, mouseClicks, screenshots, ...updatedTimeSlot } =
      timeSot;

    let data = {
      updateOne: {
        filter: { captureStartTime: value },
        update: {
          $set: {
            keystrokes: timeSot.keystrokes,
            mouseClicks: timeSot.mouseClicks,
            screenshots: timeSot.screenshots,
          },
          $setOnInsert: updatedTimeSlot,
        },
        upsert: true,
      },
    };
    bulkInsertObject.push(data);
  });
  return bulkInsertObject;
};

const createScreenshotSlots = (
  screenshotData: any,
  slotSize: number,
  payloadData: any
) => {
  Object.entries(screenshotData).forEach(([startTime, screenshot]) => {
    let newSlot = TimeSlotService.createScreenshotSlot(
      slotSize,
      startTime,
      screenshot
    );
    groupBulkPayload(payloadData, startTime, newSlot);
  });
};

const createAndUpdateMinutePulseSlot = (
  minutePulses: any,
  slotSize: number,
  payloadData: any
) => {
  Object.entries(minutePulses).forEach(([startTime, minutePulse]) => {
    if (payloadData[startTime]) {
      updateMinutePulseSlotData(minutePulse, slotSize, payloadData[startTime]);
    } else {
      payloadData[startTime] = payloadData[startTime] || [];
      let newSlot = createMinutePulseTimeSlot(startTime, minutePulse, slotSize);
      payloadData[startTime].push(newSlot);
    }
  });
};

const createMinutePulseTimeSlot = (
  startTime: string,
  minutePulses: any,
  slotSize: number
) => {
  let { keys, clicks } = keystrokesAndClicks(minutePulses, slotSize);

  let timeSlot: any = {
    mouseClicks: clicks,
    keystrokes: keys,
    totalTime: 0,
    onlineTime: 0,
    offlineTime: 0,
    productiveTime: 0,
    offlineReason: "",
    captureStartTime: getStartTime(slotSize * 60000, new Date(startTime)),
    captureEndTime: getEndTime(
      slotSize * 60000,
      new Date(minutePulses[0].minuteTime)
    ),
    userId: "638f1e3f555e42102ec04e81",
    companyId: "638f1e3f555e42102ec04e71",
    screenshots: [],
  };
  return timeSlot;
};

const updateMinutePulseSlotData = (
  minutePulse: any,
  slotSize: number,
  timeSlot: TimePerSlotDocument[]
) => {
  minutePulse.forEach((value: any) => {
    let index = getCaptureMinute(value, slotSize);
    timeSlot[0].mouseClicks[index] = value.mouseClicks;
    timeSlot[0].keystrokes[index] = value.keystrokes;
  });
};

const groupBulkPayload = (
  bulkPayload: any,
  startTime: any,
  timePerSlot: TimePerSlotDocument[]
) => {
  bulkPayload[startTime] = bulkPayload[startTime] || [];
  bulkPayload[startTime].push(timePerSlot);
};

const groupMinutePulseData = (
  minutePulses: MinutePulseInput[],
  slotSize: number,
  minutePulseSlots: any
) => {
  if (minutePulses.length > 0) {
    minutePulses.forEach((minutePulse) => {
      let minuteTime = new Date(minutePulse.minuteTime);
      const startTime = getStartTime(
        slotSize * 60000,
        minuteTime
      ).toISOString();
      minutePulseSlots[startTime] = minutePulseSlots[startTime] || [];
      minutePulseSlots[startTime].push(minutePulse);
    });
  }
  return minutePulseSlots;
};

const keystrokesAndClicks = (
  minutePulse: MinutePulseInput[],
  slotSize: number
) => {
  let keys: number[] = Array(slotSize).fill(0);
  let clicks: number[] = Array(slotSize).fill(0);
  minutePulse.forEach((value: any) => {
    let index = getCaptureMinute(value, slotSize);
    clicks[index] = value.mouseClicks;
    keys[index] = value.keystrokes;
  });
  return { keys, clicks };
};

const getCaptureMinute = (minutePulse: MinutePulseInput, slotSize: number) => {
  return new Date(minutePulse.minuteTime).getMinutes() % slotSize;
};

export default { processAndUploadData };
