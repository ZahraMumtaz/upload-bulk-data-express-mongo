/** source/routes/posts.ts */
import express from "express";
import screenshotController from "../controllers/screenshotsController";
const screenshotRouter = express.Router();

screenshotRouter.post("/upload", screenshotController.processScreenshotData);

export = screenshotRouter;
