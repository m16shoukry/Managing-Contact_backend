import { UserService } from "./user.service";
import { HashUtil } from "../utils/hash.util";
import jwt from "jsonwebtoken";
import { LoginResponseDto } from "../dtos/login.dto";

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async login(
    userName: string,
    password: string
  ): Promise<LoginResponseDto | null> {
    const user = await this.userService.getUserByUsername(userName);

    if (user && (await HashUtil.comparePassword(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, userName: user.userName },
        String(process.env.JWT_SECRET),
        { expiresIn: "1h" }
      );
      return { token, expireInSeconds: 3600 };
    }

    return null;
  }
}
