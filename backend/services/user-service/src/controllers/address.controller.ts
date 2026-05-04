import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Address, IAddress } from '../models/address.model'

export class AddressController {
  // Get all addresses for current user
  static async getUserAddresses(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      // Convert string ID to ObjectId
      const userIdObj = new mongoose.Types.ObjectId(userId)
      const addresses = await Address.find({ 
        user: userIdObj,
        isActive: true 
      }).sort({ isDefault: -1, createdAt: -1 })

      res.json({
        success: true,
        data: {
          addresses,
          count: addresses.length
        }
      })
    } catch (error: any) {
      console.error('Get addresses error:', error)
      res.status(500).json({ 
        success: false,
        error: 'Failed to get addresses' 
      })
    }
  }

  // Get a specific address
  static async getAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      // Convert string IDs to ObjectId
      const addressIdObj = new mongoose.Types.ObjectId(id)
      const userIdObj = new mongoose.Types.ObjectId(userId)

      const address = await Address.findOne({
        _id: addressIdObj,
        user: userIdObj,
        isActive: true
      })

      if (!address) {
        return res.status(404).json({ 
          success: false,
          error: 'Address not found' 
        })
      }

      res.json({
        success: true,
        data: { address }
      })
    } catch (error: any) {
      console.error('Get address error:', error)
      res.status(500).json({ 
        success: false,
        error: 'Failed to get address' 
      })
    }
  }

  // Get default address (shipping or billing)
  static async getDefaultAddress(req: Request, res: Response) {
    try {
      const { type = 'shipping' } = req.query
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      if (!['shipping', 'billing'].includes(type as string)) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid address type. Must be "shipping" or "billing"' 
        })
      }

      // Convert string ID to ObjectId
      const userIdObj = new mongoose.Types.ObjectId(userId)

      const address = await Address.findOne({
        user: userIdObj,
        $or: [
          { type: type },
          { type: 'both' }
        ],
        isDefault: true,
        isActive: true
      })

      if (!address) {
        return res.status(404).json({ 
          success: false,
          error: 'No default address found' 
        })
      }

      res.json({
        success: true,
        data: { address }
      })
    } catch (error: any) {
      console.error('Get default address error:', error)
      res.status(500).json({ 
        success: false,
        error: 'Failed to get default address' 
      })
    }
  }

  // Create a new address
  static async createAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      // Convert string ID to ObjectId
      const userIdObj = new mongoose.Types.ObjectId(userId)

      const addressData = {
        ...req.body,
        user: userIdObj
      }

      // Validate required fields
      const requiredFields = ['contactName', 'contactPhone', 'addressLine1', 'city', 'state', 'country', 'postalCode']
      const missingFields = requiredFields.filter(field => !addressData[field])
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        })
      }

      // Validate address type
      if (!['shipping', 'billing', 'both'].includes(addressData.type || 'shipping')) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid address type. Must be "shipping", "billing", or "both"' 
        })
      }

      const address = new Address(addressData)
      await address.save()

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: { address }
      })
    } catch (error: any) {
      console.error('Create address error:', error)
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          success: false,
          error: 'Validation error',
          details: error.errors 
        })
      }
      
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false,
          error: 'Duplicate address found' 
        })
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to create address' 
      })
    }
  }

  // Update an address
  static async updateAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      // Convert string IDs to ObjectId
      const addressIdObj = new mongoose.Types.ObjectId(id)
      const userIdObj = new mongoose.Types.ObjectId(userId)

      const address = await Address.findOne({
        _id: addressIdObj,
        user: userIdObj,
        isActive: true
      })

      if (!address) {
        return res.status(404).json({ 
          success: false,
          error: 'Address not found' 
        })
      }

      // Don't allow changing user ID
      if (req.body.user) {
        delete req.body.user
      }

      // Use updateOne instead of save() to avoid TypeScript issues
      await Address.updateOne(
        { _id: addressIdObj, user: userIdObj },
        { $set: req.body }
      )

      // Fetch updated address
      const updatedAddress = await Address.findOne({
        _id: addressIdObj,
        user: userIdObj,
        isActive: true
      })

      res.json({
        success: true,
        message: 'Address updated successfully',
        data: { address: updatedAddress }
      })
    } catch (error: any) {
      console.error('Update address error:', error)
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          success: false,
          error: 'Validation error',
          details: error.errors 
        })
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to update address' 
      })
    }
  }

  // Delete an address (soft delete)
  static async deleteAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      // Convert string IDs to ObjectId
      const addressIdObj = new mongoose.Types.ObjectId(id)
      const userIdObj = new mongoose.Types.ObjectId(userId)

      const address = await Address.findOne({
        _id: addressIdObj,
        user: userIdObj
      })

      if (!address) {
        return res.status(404).json({ 
          success: false,
          error: 'Address not found' 
        })
      }

      // Check if this is the default address
      if (address.isDefault) {
        return res.status(400).json({ 
          success: false,
          error: 'Cannot delete default address. Set another address as default first.' 
        })
      }

      // Use updateOne for soft delete (avoid save() TypeScript issues)
      await Address.updateOne(
        { _id: addressIdObj, user: userIdObj },
        { $set: { isActive: false } }
      )

      res.json({
        success: true,
        message: 'Address deleted successfully'
      })
    } catch (error: any) {
      console.error('Delete address error:', error)
      res.status(500).json({ 
        success: false,
        error: 'Failed to delete address' 
      })
    }
  }

  // Set address as default
  static async setDefaultAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { type = 'shipping' } = req.body
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Not authenticated' 
        })
      }

      if (!['shipping', 'billing'].includes(type)) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid address type. Must be "shipping" or "billing"' 
        })
      }

      // Convert string IDs to ObjectId
      const addressIdObj = new mongoose.Types.ObjectId(id)
      const userIdObj = new mongoose.Types.ObjectId(userId)

      // Get the address to make default
      const address = await Address.findOne({
        _id: addressIdObj,
        user: userIdObj,
        isActive: true
      })

      if (!address) {
        return res.status(404).json({ 
          success: false,
          error: 'Address not found' 
        })
      }

      // Check if address type matches
      if (address.type !== type && address.type !== 'both') {
        return res.status(400).json({ 
          success: false,
          error: `This address is not configured for ${type} type` 
        })
      }

      // Start a session for transaction
      const session = await mongoose.startSession()
      
      try {
        await session.startTransaction()
        
        // Reset all default addresses of this type for the user
        await Address.updateMany(
          { 
            user: userIdObj, 
            $or: [
              { type: type },
              { type: 'both' }
            ],
            isActive: true,
            _id: { $ne: addressIdObj }  // Use ObjectId, not string
          },
          { $set: { isDefault: false } },
          { session }
        )
        
        // Set the new address as default
        await Address.updateOne(
          { 
            _id: addressIdObj,
            user: userIdObj,
            isActive: true 
          },
          { $set: { isDefault: true } },
          { session }
        )
        
        await session.commitTransaction()
        
        // Fetch updated address
        const updatedAddress = await Address.findOne({
          _id: addressIdObj,
          user: userIdObj,
          isActive: true
        })
        
        res.json({
          success: true,
          message: 'Default address updated successfully',
          data: { address: updatedAddress }
        })
      } catch (error) {
        await session.abortTransaction()
        throw error
      } finally {
        session.endSession()
      }
    } catch (error: any) {
      console.error('Set default address error:', error)
      res.status(500).json({ 
        success: false,
        error: 'Failed to set default address' 
      })
    }
  }

  // Validate address (without saving)
  static async validateAddress(req: Request, res: Response) {
    try {
      const addressData = req.body
      
      // Create a temporary address for validation
      const tempAddress = new Address(addressData)
      
      // Validate
      const validationErrors = tempAddress.validateSync()
      
      if (validationErrors) {
        const errors: Record<string, string> = {}
        Object.keys(validationErrors.errors).forEach(key => {
          errors[key] = validationErrors.errors[key].message
        })
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors
        })
      }

      // Additional custom validations
      const validations = {
        phone: /^[\+]?[1-9][\d]{0,15}$/.test(addressData.contactPhone || ''),
        postalCode: /^[a-zA-Z0-9\s\-]{3,10}$/.test(addressData.postalCode || ''),
        email: addressData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressData.email) : true
      }

      const isValid = Object.values(validations).every(v => v === true)

      // Get formatted address from virtual field
      const formattedAddress = tempAddress.toObject().fullAddress || ''

      res.json({
        success: true,
        data: {
          isValid,
          validations,
          formattedAddress
        }
      })
    } catch (error: any) {
      console.error('Validate address error:', error)
      res.status(500).json({ 
        success: false,
        error: 'Failed to validate address' 
      })
    }
  }
}
