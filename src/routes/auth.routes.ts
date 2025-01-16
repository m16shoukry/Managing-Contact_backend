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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 *
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Endpoint to log in a user with a username and password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad Request (Invalid input)
 *       401:
 *         description: Unauthorized (Invalid credentials)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         userName:
 *           type: string
 *           example: "user1"
 *         password:
 *           type: string
 *           example: "user1"
 */

authRoutes.post("/login", validateDto(LoginDto), (req, res) =>
  authController.login(req, res)
);

export default authRoutes;
