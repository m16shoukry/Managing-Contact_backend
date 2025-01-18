import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const sseValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.query.token as string;

  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (error: any) {
    console.error("Token validation failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
