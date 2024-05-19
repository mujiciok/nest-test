import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  subject: string;

  @IsString()
  content: string;
}
