import { UserRepository } from "../repositories/user.repository";
import { HashUtil } from "../utils/hash.util";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async createUser(userName: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ userName });
    if (!existingUser) {
      try {
        const hashedPassword = await HashUtil.hashPassword(password);
        await this.userRepository.create({
          userName,
          password: hashedPassword,
        });
        console.log(`User created: ${userName}`);
      } catch (error: any) {
        console.log(`Error creating user ${userName}: ${error.message}`);
      }
    } else {
      console.log(`User already exists: ${userName}`);
    }
  }

  async seedUsers(): Promise<void> {
    await this.createUser("user1", "user1");
    await this.createUser("user2", "user2");
  }

  async getUserByUsername(userName: string): Promise<any> {
    return this.userRepository.findOne({ userName });
  }
}
