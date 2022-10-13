import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.entity';
import { Product } from './../../products/entities/product.entity';

@Schema()
export class Order extends Document {
  @Prop()
  date: Date;

  @Prop()
  user: User;

  @Prop()
  products: Product[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
