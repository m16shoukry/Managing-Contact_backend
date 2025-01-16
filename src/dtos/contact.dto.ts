import { IsString, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^01[0-9]{9}$/, {
    message:
      "Phone number must be a valid Egyptian mobile number starting with '01' and have 11 digits.",
  })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^01[0-9]{9}$/, {
    message:
      "Phone number must be a valid Egyptian mobile number starting with '01' and have 11 digits.",
  })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ListContactsFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]{9}$/, {
    message:
      "Phone number must be a valid Egyptian mobile number starting with '01' and have 11 digits.",
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  deleted?: boolean;
}
