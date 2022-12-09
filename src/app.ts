import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import "./database.ts";
import http from "http";
import screenshotRouter from "./routes/screenshot";

dotenv.config({ path: "./.env" });

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());

app.use("/screenshot", screenshotRouter);

app.get("/", () => console.log("API is UP and Running"));

app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("API is UP and Running");
});

const httpServer = http.createServer(app);
httpServer.listen(port, () =>
  console.log(`The server is running on port ${port}`)
);
