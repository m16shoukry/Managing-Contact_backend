import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { validateDto } from "../middlewares/validate-dto.middleware";
import { LoginDto } from "../dtos/login.dto";

const authRoutes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userService);
const authController = new AuthController(authService);

authRoutes.post("/login", validateDto(LoginDto), (req, res) =>
  authController.login(req, res)
);

export default authRoutes;
