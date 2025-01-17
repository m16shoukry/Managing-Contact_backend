import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ErrorApiResponse } from "../core/api-response/Error-api-response.dto";
import { SuccessApiResponse } from "../core/api-response/success-api-response.dto";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { userName, password } = req.body;

      if (!userName || !password) {
        res
          .status(400)
          .json(new ErrorApiResponse("Username and password are required"));
        return;
      }

      const token = await this.authService.login(userName, password);

      if (token) {
        res.status(200).json(new SuccessApiResponse(token, "Login successful"));
      } else {
        res
          .status(401)
          .json(new ErrorApiResponse("Invalid username or password"));
      }
    } catch (error: any) {
      console.error("Error in login:", error.message);
      res.status(500).json(new ErrorApiResponse("Internal server error"));
    }
  }
}
