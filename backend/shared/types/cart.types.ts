// backend/shared/types/cart.types.ts
import { Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addedAt: Date;
  updatedAt: Date;
}

export interface ICart {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartTotals {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  itemCount: number;
  items: ICartItem[];
}

export interface AddToCartRequest {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}