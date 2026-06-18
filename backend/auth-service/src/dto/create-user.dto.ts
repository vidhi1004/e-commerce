import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/enum/role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  role: Role;
}
