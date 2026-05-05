// @ts-nocheck
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Address } from '../models/address.model'

export class AddressController {
  // Get all addresses for a user
  static async getUserAddresses(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const addresses = await Address.findByUser(userId)
      
      res.json({
        success: true,
        addresses
      })
    } catch (error: any) {
      console.error('Get addresses error:', error)
      res.status(500).json({ error: 'Failed to get addresses' })
    }
  }

  // Get a single address
  static async getAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const address = await Address.findOne({
        _id: id,
        user: userId,
        isActive: true
      })

      if (!address) {
        return res.status(404).json({ error: 'Address not found' })
      }

      res.json({
        success: true,
        address
      })
    } catch (error: any) {
      console.error('Get address error:', error)
      res.status(500).json({ error: 'Failed to get address' })
    }
  }

  // Create a new address
  static async createAddress(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const addressData = {
        ...req.body,
        user: userId
      }

      const address = new Address(addressData)
      await address.save()

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        address
      })
    } catch (error: any) {
      console.error('Create address error:', error)
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors 
        })
      }
      
      res.status(500).json({ error: 'Failed to create address' })
    }
  }

  // Update an address
  static async updateAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const address = await Address.findOne({
        _id: id,
        user: userId,
        isActive: true
      })

      if (!address) {
        return res.status(404).json({ error: 'Address not found' })
      }

      // Update address fields
      Object.assign(address, req.body)
      await address.save()

      res.json({
        success: true,
        message: 'Address updated successfully',
        address
      })
    } catch (error: any) {
      console.error('Update address error:', error)
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.errors 
        })
      }
      
      res.status(500).json({ error: 'Failed to update address' })
    }
  }

  // Delete an address (soft delete)
  static async deleteAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      const address = await Address.findOne({
        _id: id,
        user: userId
      })

      if (!address) {
        return res.status(404).json({ error: 'Address not found' })
      }

      // Soft delete by setting isActive to false
      address.isActive = false
      await address.save()

      res.json({
        success: true,
        message: 'Address deleted successfully'
      })
    } catch (error: any) {
      console.error('Delete address error:', error)
      res.status(500).json({ error: 'Failed to delete address' })
    }
  }

  // Set address as default
  static async setDefaultAddress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { type = 'shipping' } = req.body
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      if (!['shipping', 'billing'].includes(type)) {
        return res.status(400).json({ error: 'Invalid address type' })
      }

      await Address.updateDefaultAddress(userId, id, type)

      res.json({
        success: true,
        message: 'Default address updated successfully'
      })
    } catch (error: any) {
      console.error('Set default address error:', error)
      res.status(500).json({ error: 'Failed to set default address' })
    }
  }

  // Validate address
  static async validateAddress(req: Request, res: Response) {
    try {
      const addressData = req.body
      
      // Create a temporary address instance for validation
      const tempAddress = new Address(addressData)
      
      const validationErrors = tempAddress.validateSync()
      
      if (validationErrors) {
        return res.status(400).json({
          success: false,
          errors: validationErrors.errors
        })
      }

      // Additional custom validations
      const validations = {
        phone: tempAddress.validatePhone(),
        postalCode: tempAddress.validatePostalCode()
      }

      const isValid = Object.values(validations).every(v => v === true)

      res.json({
        success: true,
        isValid,
        validations
      })
    } catch (error: any) {
      console.error('Validate address error:', error)
      res.status(500).json({ error: 'Failed to validate address' })
    }
  }

  // Get default address
  static async getDefaultAddress(req: Request, res: Response) {
    try {
      const { type = 'shipping' } = req.query
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      if (!['shipping', 'billing'].includes(type as string)) {
        return res.status(400).json({ error: 'Invalid address type' })
      }

      const address = await Address.findDefaultAddress(userId, type as 'shipping' | 'billing')

      if (!address) {
        return res.status(404).json({ error: 'No default address found' })
      }

      res.json({
        success: true,
        address
      })
    } catch (error: any) {
      console.error('Get default address error:', error)
      res.status(500).json({ error: 'Failed to get default address' })
    }
  }
}
