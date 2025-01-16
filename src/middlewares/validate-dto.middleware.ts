import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ErrorApiResponse } from "../core/api-response/Error-api-response.dto";

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors.map((err) =>
        Object.values(err.constraints || {}).join(", ")
      );

      res.status(400).json(new ErrorApiResponse(errorMessages.join(", ")));
      return;
    }

    next();
  };
}
