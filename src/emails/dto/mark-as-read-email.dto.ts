import { IsBoolean, IsNotEmpty } from 'class-validator';

export class MarkAsReadEmailDto {
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;
}
