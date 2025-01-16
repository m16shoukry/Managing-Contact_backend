import express, { Application } from "express";
import logger from "./core/logger";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import "reflect-metadata";
import * as dotenv from "dotenv";
import { seedDatabase } from "./core/seed";
import authRoutes from "./routes/auth.routes";
import helmet from "helmet";
import contactRoutes from "./routes/contact.routes";
import { setupSwagger } from "./core/swagger";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contacts", contactRoutes);

setupSwagger(app);

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("Database connection not found");
    }
    await mongoose.connect(process.env.DB_URL);
    logger.info("Database connected successfully");
  } catch (error: any) {
    logger.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      logger.info(`App running on port: ${PORT}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start the server: ${error.message}`);
  }
};

startServer();
