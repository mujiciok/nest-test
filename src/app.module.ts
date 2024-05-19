import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './database/database.module';
import { EmailsModule } from './emails/emails.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [],
      synchronize: true, //to be changed to 'false' for production environment
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    EmailsModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, JwtService],
})
export class AppModule {}
