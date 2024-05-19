import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    EmailsService,
  ],
  controllers: [EmailsController],
})
export class EmailsModule {}
