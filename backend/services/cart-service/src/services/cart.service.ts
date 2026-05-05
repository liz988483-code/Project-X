// backend/services/order-service/src/services/cart.service.ts
import { Types } from 'mongoose';
import { Cart, ICartDocument } from '../models/cart.model';
import { ICartItem, CartTotals, AddToCartRequest } from '../../../../shared/types/cart.types';
import { 
  ApiError, 
  BadRequestError, 
  NotFoundError,
  CartItemNotFoundError 
} from '../../../../shared/utils/api-error';

export class CartService {
  /**
   * Get or create cart for user
   */
  static async getCart(userId: Types.ObjectId): Promise<ICartDocument> {
    try {
      let cart = await Cart.findOne({ user: userId });
      
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }
      
      return cart;
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to retrieve cart', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(
    userId: Types.ObjectId, 
    itemData: AddToCartRequest
  ): Promise<ICartDocument> {
    try {
      // Validate input
      if (!itemData.product) {
        throw new BadRequestError('Product ID is required');
      }
      if (!itemData.seller) {
        throw new BadRequestError('Seller ID is required');
      }
      if (!itemData.name || itemData.name.trim().length === 0) {
        throw new BadRequestError('Product name is required');
      }
      if (!itemData.price || itemData.price <= 0) {
        throw new BadRequestError('Valid price is required');
      }
      if (!itemData.quantity || itemData.quantity <= 0) {
        throw new BadRequestError('Quantity must be greater than 0');
      }
      
      const cart = await this.getCart(userId);
      
      // Find if item already exists
      const existingItemIndex = cart.items.findIndex(
        (item: ICartItem) => item.product.toString() === itemData.product.toString()
      );
      
      if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += itemData.quantity;
        cart.items[existingItemIndex].updatedAt = new Date();
      } else {
        // Add new item
        const cartItem: ICartItem = {
          product: itemData.product,
          seller: itemData.seller,
          name: itemData.name,
          price: itemData.price,
          quantity: itemData.quantity,
          image: itemData.image,
          addedAt: new Date(),
          updatedAt: new Date()
        };
        
        cart.items.push(cartItem);
      }
      
      await cart.save();
      return cart;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500, 
        'Failed to add item to cart', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(
    userId: Types.ObjectId, 
    productId: Types.ObjectId
  ): Promise<ICartDocument> {
    try {
      const cart = await this.getCart(userId);
      
      // Check if item exists in cart
      const initialItemCount = cart.items.length;
      cart.items = cart.items.filter(
        (item: ICartItem) => item.product.toString() !== productId.toString()
      );
      
      if (cart.items.length === initialItemCount) {
        throw new CartItemNotFoundError(productId.toString());
      }
      
      await cart.save();
      return cart;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500, 
        'Failed to remove item from cart', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    quantity: number
  ): Promise<ICartDocument> {
    try {
      if (quantity < 1) {
        throw new BadRequestError('Quantity must be at least 1');
      }
      
      const cart = await this.getCart(userId);
      
      // Check if item exists
      const itemIndex = cart.items.findIndex(
        (item: ICartItem) => item.product.toString() === productId.toString()
      );
      
      if (itemIndex === -1) {
        throw new CartItemNotFoundError(productId.toString());
      }
      
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].updatedAt = new Date();
      await cart.save();
      return cart;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500, 
        'Failed to update cart item', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Clear all items from cart
   */
  static async clearCart(userId: Types.ObjectId): Promise<ICartDocument> {
    try {
      const cart = await this.getCart(userId);
      cart.items = [];
      await cart.save();
      return cart;
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to clear cart', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Calculate cart totals
   */
  static async getCartTotals(userId: Types.ObjectId): Promise<CartTotals> {
    try {
      const cart = await this.getCart(userId);
      
      // Calculate totals
      const subtotal = cart.items.reduce(
        (sum: number, item: ICartItem) => sum + (item.price * item.quantity), 
        0
      );
      const itemCount = cart.items.reduce(
        (sum: number, item: ICartItem) => sum + item.quantity, 
        0
      );
      
      // For now, use simple calculations
      const discountAmount = 0;
      const shippingCost = subtotal > 50 ? 0 : 10; // Free shipping over $50
      const taxAmount = subtotal * 0.08; // 8% tax
      const total = subtotal - discountAmount + shippingCost + taxAmount;
      
      return {
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
        itemCount,
        items: cart.items
      };
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to calculate cart totals', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Get cart item count
   */
  static async getCartItemCount(userId: Types.ObjectId): Promise<number> {
    try {
      const cart = await this.getCart(userId);
      return cart.items.reduce((sum: number, item: ICartItem) => sum + item.quantity, 0);
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to get cart item count', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Get cart summary with totals
   */
  static async getCartSummary(userId: Types.ObjectId): Promise<{
    cartId: Types.ObjectId;
    userId: Types.ObjectId;
    itemCount: number;
    items: ICartItem[];
    totals: CartTotals;
    createdAt: Date;
    updatedAt: Date;
  }> {
    try {
      const cart = await this.getCart(userId);
      const totals = await this.getCartTotals(userId);
      
      return {
        cartId: cart._id,
        userId: cart.user,
        itemCount: totals.itemCount,
        items: cart.items,
        totals,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      };
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to get cart summary', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Get cart by ID (for admin purposes)
   */
  static async getCartById(cartId: Types.ObjectId): Promise<ICartDocument> {
    try {
      const cart = await Cart.findById(cartId);
      
      if (!cart) {
        throw new NotFoundError('Cart not found');
      }
      
      return cart;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500, 
        'Failed to get cart by ID', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Merge guest cart with user cart (for when user logs in)
   */
  static async mergeCarts(
    userId: Types.ObjectId,
    guestCartItems: ICartItem[]
  ): Promise<ICartDocument> {
    try {
      const userCart = await this.getCart(userId);
      
      for (const guestItem of guestCartItems) {
        const existingItemIndex = userCart.items.findIndex(
          (item: ICartItem) => item.product.toString() === guestItem.product.toString()
        );
        
        if (existingItemIndex > -1) {
          // Update quantity
          userCart.items[existingItemIndex].quantity += guestItem.quantity;
          userCart.items[existingItemIndex].updatedAt = new Date();
        } else {
          // Add new item
          const cartItem: ICartItem = {
            ...guestItem,
            addedAt: new Date(),
            updatedAt: new Date()
          };
          userCart.items.push(cartItem);
        }
      }
      
      await userCart.save();
      return userCart;
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to merge carts', 
        false, 
        undefined, 
        error.message
      );
    }
  }

  /**
   * Validate cart items (check if products still exist, prices haven't changed, etc.)
   */
  static async validateCart(userId: Types.ObjectId): Promise<{
    isValid: boolean;
    invalidItems: Array<{
      item: ICartItem;
      reason: string;
    }>;
    updatedCart?: ICartDocument;
  }> {
    try {
      const cart = await this.getCart(userId);
      const invalidItems: Array<{ item: ICartItem; reason: string }> = [];
      
      // For now, just return basic validation
      // In production, you would:
      // 1. Check if products still exist
      // 2. Verify current prices
      // 3. Check stock availability
      // 4. Remove or update invalid items
      
      const isValid = invalidItems.length === 0;
      
      return {
        isValid,
        invalidItems,
        updatedCart: isValid ? cart : undefined
      };
    } catch (error: any) {
      throw new ApiError(
        500, 
        'Failed to validate cart', 
        false, 
        undefined, 
        error.message
      );
    }
  }
}