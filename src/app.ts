import express from "express";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { router as unProtectedAppApi } from "@/routes/unprotected/appApi";
import { notFound, productionErrors } from "@/handlers/error/errorHandlers";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 25,
    message: "Too many requests from this IP, please try again after a minute",
    legacyHeaders: false,
  });

  app.use(
    express.json({
      verify: (req: any, res, buf: any) => {
        req.rawBody = buf.toString("utf8");
      },
    })
  );

  app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "params"],
    })
  );

  app.use(limiter);

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  // routes
  app.use("/api/", unProtectedAppApi);
  app.use("/health", (_, res) => {
    res.status(200).send("OK");
  });
  // routes

  app.use(notFound);
  app.use(productionErrors);
  return app;
};
