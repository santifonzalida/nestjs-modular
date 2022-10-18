import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Db } from 'mongodb';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductDto,
} from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('MONGO') private database: Db,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  getDBProducts() {
    //sin mongoose
    const productsCollection = this.database.collection('products');
    return productsCollection.find().toArray();
  }

  findAll(params: FilterProductDto) {
    if (params) {
      const filter: FilterQuery<Product> = {};
      const { limit, offset } = params;
      const { minPrice, maxPrice } = params;
      if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
      }
      return this.productModel
        .find(filter)
        .populate('brand')
        .skip(offset)
        .limit(limit)
        .exec();
    }
    return this.productModel.find().populate('brand').exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {
    console.log(changes);
    const product = this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
