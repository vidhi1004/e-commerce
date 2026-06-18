import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './auth/auth.guard';
import { Role } from './enum/role.enum';
import { RoleGuard } from './auth/role.guard';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.registerCustomer(createUserDto);
  }
  @UseGuards(AuthGuard)
  @SetMetadata('role', Role['ADMIN'])
  @UseGuards(AuthGuard)
  @Get()
  getAllUsers() {
    return this.appService.getAllUsers();
  }
  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.appService.login(loginUserDto);
  }

  @Post('refresh_token')
  GetRefreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.appService.reGenerateRefreshToken(refreshTokenDto);
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.appService.getUserById(id, userId);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  UpdateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const userId = Number(req.user.id);
    return this.appService.updateUser(updateUserDto, id, userId);
  }

  @UseGuards(RoleGuard)
  @Post(':id')
  logout(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.appService.logout(id, userId);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = Number(req.user.id);
    return this.appService.deleteUser(id, userId);
  }
}
