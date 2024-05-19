import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import { MarkAsReadEmailDto } from './dto/mark-as-read-email.dto';
import { emailConstants } from './constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmailsService {
  constructor(@InjectRepository(Email) private repo: Repository<Email>) {}

  async create(user: User, createEmailDto: CreateEmailDto) {
    const email = await this.repo.create({
      userId: user.id,
      senderEmail: user.email,
      ...createEmailDto,
    });
    return this.repo.save(email);
  }

  findAll(user: User, type: number = emailConstants.SENT_EMAILS) {
    if (+type === emailConstants.RECEIVED_EMAILS) {
      return this.repo.findBy({ senderEmail: user.email });
    }

    return this.repo.findBy({ receiverEmail: user.email });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(email: Email, updateEmailDto: UpdateEmailDto) {
    await this.repo.update(
      {
        id: email.id,
      },
      { ...updateEmailDto },
    );

    return {
      ...email,
      ...updateEmailDto,
    };
  }

  async markAsRead(email: Email, markAsReadEmailDto: MarkAsReadEmailDto) {
    await this.repo.update(
      {
        id: email.id,
      },
      { ...markAsReadEmailDto },
    );

    return {
      ...email,
      ...markAsReadEmailDto,
    };
  }

  remove(email: Email) {
    return this.repo.remove(email);
  }
}
