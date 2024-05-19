import { CreateEmailDto } from './create-email.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateEmailDto extends PartialType(CreateEmailDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  subject: string;

  @IsString()
  content: string;
}
