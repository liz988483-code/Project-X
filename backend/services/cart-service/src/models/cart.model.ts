// backend/services/order-service/src/models/cart.model.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

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

export interface ICartDocument extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  seller: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    default: 1 
  },
  image: { 
    type: String 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

const cartSchema = new Schema<ICartDocument>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  items: [cartItemSchema]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      const transformed = ret as any;
      transformed.id = transformed._id;
      delete transformed._id;
      delete transformed.__v;
      return transformed;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });
cartSchema.index({ 'items.seller': 1 });

export const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);
export type ICart = ICartDocument;