import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../migration/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email
    });
    return createdUser.save();
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseDto | undefined> {
    const user = await this.userModel.findOne({ $or: [
      { username: loginUserDto?.username },
      { email: loginUserDto?.email },
    ], }).exec();

    if (!user) {
      throw new BadRequestException('Invalid username');
    }
    
    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid password');
    }

    return user as UserResponseDto;
  }

  async findOne(username: string): Promise<UserResponseDto | undefined> {
    return this.userModel.findOne({ username }).exec() as Promise<UserResponseDto>;
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.userModel.find().exec() as  Promise<UserResponseDto[]>;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec() as Promise<UserResponseDto>;
  }

  async remove(id: string): Promise<UserResponseDto> {
    return this.userModel.findOneAndDelete({_id:id}).exec() as Promise<UserResponseDto>;
  }
}