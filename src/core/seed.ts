import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

export const seedDatabase = async () => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  try {
    await userService.seedUsers();
    console.log("Seeding completed!");
  } catch (error: any) {
    console.error("Error during seeding:", error.message);
  }
};
