import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "Username is required" })
  @IsString({ message: "Username must be a string" })
  userName!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  password!: string;
}

export class LoginResponseDto {
  token!: string;

  expireInSeconds!: number;
}
