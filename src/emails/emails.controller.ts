import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarkAsReadEmailDto } from './dto/mark-as-read-email.dto';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  create(@Request() req, @Body() createEmailDto: CreateEmailDto) {
    return this.emailsService.create(req.user, createEmailDto);
  }

  @Get()
  findAll(@Request() req, @Query('type') type: number) {
    return this.emailsService.findAll(req.user, type);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const email = await this.emailsService.findOne(+id);

    if (!email) {
      throw new NotFoundException();
    }

    if (
      email.senderEmail !== req.user.email &&
      email.receiverEmail !== req.user.email
    ) {
      throw new ForbiddenException();
    }

    return email;
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    const email = await this.emailsService.findOne(+id);

    if (!email) {
      throw new NotFoundException();
    }

    if (email.senderEmail !== req.user.email) {
      throw new ForbiddenException();
    }

    return this.emailsService.update(email, updateEmailDto);
  }

  @Patch(':id/read')
  async markAsRead(
    @Request() req,
    @Param('id') id: string,
    @Body() markAsReadEmailDto: MarkAsReadEmailDto,
  ) {
    const email = await this.emailsService.findOne(+id);

    if (!email) {
      throw new NotFoundException();
    }

    if (email.receiverEmail !== req.user.email) {
      throw new ForbiddenException();
    }

    return this.emailsService.markAsRead(email, markAsReadEmailDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const email = await this.emailsService.findOne(+id);

    if (!email) {
      throw new NotFoundException();
    }

    if (email.userId !== req.user.id) {
      throw new ForbiddenException();
    }

    return this.emailsService.remove(email);
  }
}
