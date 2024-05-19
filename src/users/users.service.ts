import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { scrypt as _scrypt } from 'crypto';
import { randomBytes } from 'node:crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.repo.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 23)) as Buffer;
    const result = salt + '..' + hash.toString('hex');
    const email = createUserDto.email;

    const user = this.repo.create({
      email: email,
      username: email.substring(0, email.indexOf('@')),
      password: result,
    });

    return this.repo.save(user);
  }
}
