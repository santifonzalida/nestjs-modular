import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './../../products/entities/product.entity';
import { Customer } from './customer.entity';

@Schema()
export class Order extends Document {
  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customer: Customer | Types.ObjectId; // relation 1:1 customer

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products: Types.Array<Product>; // relation 1:N
}

export const OrderSchema = SchemaFactory.createForClass(Order);
