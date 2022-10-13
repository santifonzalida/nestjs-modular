import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  create(data: CreateUserDto) {
    const newUser = new this.userModel(data);
    return newUser.save();
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
