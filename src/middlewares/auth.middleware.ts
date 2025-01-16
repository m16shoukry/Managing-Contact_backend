import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorApiResponse } from "../core/api-response/Error-api-response.dto";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json(new ErrorApiResponse("No token provided"));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req["userId"] = (decoded as any).id;
    next();
  } catch (err) {
    res.status(401).json(new ErrorApiResponse("Invalid token"));
    return;
  }
};
