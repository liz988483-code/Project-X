import { Types } from 'mongoose';

export interface OrderItem {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  method: 'card' | 'paypal' | 'cash';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface IOrder {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
}
