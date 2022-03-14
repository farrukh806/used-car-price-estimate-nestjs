import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(userDto: CreateUserDto): Promise<User> {
    try {
      const user = this.repo.create({
        email: userDto.email,
        password: userDto.password,
      });
      return this.repo.save(user);
    } catch (error) {
      throw new Error('something went wrong');
    }
  }

  async findOne(id: number): Promise<User> {
    if (!id) {
      return null;
    }
    const user = await this.repo.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    else return user;
  }

  async find(email: string): Promise<User[]> {
    const user = await this.repo.find({ email });
    if (user) return user;
    else throw new NotFoundException('user not found');
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (user) {
      Object.assign(user, attrs);
      return this.repo.save(user);
    } else throw new NotFoundException('user not found');
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (user) {
      return await this.repo.remove(user);
    } else throw new NotFoundException('user not found');
  }
}
