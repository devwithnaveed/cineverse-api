import {  ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;

    const existingUser = await this.findUserByEmail(email);

    if(existingUser){
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if(!user){
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if(!user){
      throw new NotFoundException('User not found');
    }

    const { password, role, ...rest } = updateUserDto;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    Object.assign(user, rest);

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
