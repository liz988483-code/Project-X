import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  seller: Types.ObjectId;
  subtotal: number;
}

export interface IOrderMethods {
  calculateTotals(): void;
}

export interface IOrder extends Document, IOrderMethods {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  // Virtuals
  itemCount?: number;
}

export interface IOrderModel extends Model<IOrder, {}, IOrderMethods> {
  // Add static methods here if needed
  // Example: findByOrderNumber(orderNumber: string): Promise<IOrder | null>;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new Schema<IOrder, IOrderModel, IOrderMethods>({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  subtotal: { type: Number, required: true, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  shippingCost: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  shippingAddress: { type: Schema.Types.Mixed, required: true },
  billingAddress: { type: Schema.Types.Mixed, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for item count
orderSchema.virtual('itemCount').get(function(this: IOrder) {
  return this.items.reduce((count: number, item: IOrderItem) => {
    return count + item.quantity;
  }, 0);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  const order = this as IOrder;
  
  if (!order.orderNumber) {
    // Generate order number: ORD-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    order.orderNumber = `ORD-${dateStr}-${random}`;
  }
  
  // Ensure subtotal is calculated from items
  if (order.isModified('items')) {
    order.subtotal = order.items.reduce((total: number, item: IOrderItem) => {
      return total + (item.price * item.quantity);
    }, 0);
    order.total = order.subtotal - order.discountAmount + order.shippingCost + order.taxAmount;
  }
  
  // Ensure item subtotals are calculated
  order.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  next();
});

// Instance method
orderSchema.methods.calculateTotals = function(this: IOrder): void {
  this.subtotal = this.items.reduce((total: number, item: IOrderItem) => {
    return total + (item.price * item.quantity);
  }, 0);
  this.total = this.subtotal - this.discountAmount + this.shippingCost + this.taxAmount;
  
  // Also update item subtotals
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
};

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder, IOrderModel>('Order', orderSchema);
export default Order;