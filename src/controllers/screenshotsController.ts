import { Request, Response } from "express";
import { TimePerSlotDocument } from "../models/timePerSlot.model";
import minutePulseService from "../services/processData.service";

const processScreenshotData = async (req: Request, res: Response) => {
  const bulkObject: TimePerSlotDocument[] = [];
  let slotSize = 10;
  const payload = JSON.parse(JSON.stringify(req.body));
  const { screenshots, minutePulses } = payload.timeSlotData;

  let processData = minutePulseService.processAndUploadData(
    minutePulses,
    slotSize,
    screenshots
  );
  res.status(200).json({
    data: req.body,
  });
};

export default { processScreenshotData };
