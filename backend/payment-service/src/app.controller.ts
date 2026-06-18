import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/upate-payment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    const userId = Number(req.user.userId);
    const token = req.token;
    return this.appService.create(createPaymentDto, userId, token);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.userId);
    return this.appService.findOne(id, userId);
  }

  @Patch(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.appService.update(id, updatePaymentDto);
  }
}
