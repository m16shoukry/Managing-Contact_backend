import { UserService } from "./user.service";
import { HashUtil } from "../utils/hash.util";
import jwt from "jsonwebtoken";

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async login(userName: string, password: string): Promise<string | null> {
    const user = await this.userService.getUserByUsername(userName);

    if (user && (await HashUtil.comparePassword(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, userName: user.userName },
        String(process.env.JWT_SECRET),
        { expiresIn: "1h" }
      );
      return token;
    }

    return null;
  }
}
