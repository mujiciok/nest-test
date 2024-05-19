import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);

    if (user) {
      const [salt, storedHash] = user.password.split('..');

      const hash = (await scrypt(loginDto.password, salt, 23)) as Buffer;

      if (storedHash === hash.toString('hex')) {
        const jwtOptions = { expiresIn: '1h' };

        return {
          accessToken: this.jwtService.sign(
            {
              email: user.email,
              password: user.password,
            },
            jwtOptions,
          ),
        };
      }
    }

    throw new UnprocessableEntityException('Wrong credentials');
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const jwtOptions = { expiresIn: '1h' };

    return {
      accessToken: this.jwtService.sign(
        {
          email: user.email,
          password: user.password,
        },
        jwtOptions,
      ),
    };
  }
}
