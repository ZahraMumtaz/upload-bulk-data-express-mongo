import mongoose from "mongoose";

(async () => {
  try {
    const db = await mongoose.connect("mongodb://localhost:27017/invoDesk");
    console.log("Database connected to:", db.connection.name);
  } catch (err) {
    console.error(err);
  }
})();