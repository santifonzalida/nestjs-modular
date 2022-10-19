import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from './../../products/services/products.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  findAll() {
    const users = this.userModel.find().exec();
    return users;
  }

  findOne(id: string) {
    const user = this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = new this.userModel(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    const user = await newUser.save();
    const { password, ...res } = user.toJSON();
    return res;
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: string, changes: UpdateUserDto) {
    const user = this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async getOrderByUser(id: string) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: [],
      //products: await this.productsService.findAll({}),
    };
  }
}
