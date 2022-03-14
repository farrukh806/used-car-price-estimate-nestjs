import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { User } from './users.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(userDto: CreateUserDto): Promise<UserDto> {
    const { email, password } = userDto;

    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');

    const result = await this.findHashedPassword(password, salt);
    const userData = { email, password: result };
    const user = await this.usersService.create(userData);

    return user;
  }

  async signin(userDto: CreateUserDto): Promise<User> {
    const { email, password } = userDto;

    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('email or password is incorrect');
    }
    const [salt] = user.password.split('.');

    const result = await this.findHashedPassword(password, salt);
    if (result === user.password) {
      return user;
    } else {
      throw new BadRequestException('email or password is incorrect');
    }
  }

  async findHashedPassword(password: string, salt: string) {
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex');
    return hashedPassword;
  }
}
