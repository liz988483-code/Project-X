// @ts-nocheck
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Define the interface for the document
export interface IAddress extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: 'shipping' | 'billing' | 'both';
  label?: string;
  contactName: string;
  contactPhone: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  isActive: boolean;
  deliveryInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['shipping', 'billing', 'both'],
      required: true,
      default: 'shipping'
    },
    label: {
      type: String,
      trim: true,
      maxlength: 50
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: 200
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: 'United States'
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Add virtual 'fullAddress' field
AddressSchema.virtual('fullAddress').get(function(this: IAddress) {
  const parts = [
    this.addressLine1,
    this.addressLine2,
    this.city,
    this.state,
    this.postalCode,
    this.country
  ].filter(Boolean);
  
  return parts.join(', ');
});

// Create and export the model
const Address = mongoose.model<IAddress>('Address', AddressSchema);

export { Address };
export type { IAddress };

