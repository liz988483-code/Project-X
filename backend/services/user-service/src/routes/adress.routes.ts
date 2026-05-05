// @ts-nocheck
import express from 'express'
import { AddressController } from '../controllers/address.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = express.Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Address routes
router.get('/', AddressController.getUserAddresses)
router.get('/default', AddressController.getDefaultAddress)
router.post('/', AddressController.createAddress)
router.post('/validate', AddressController.validateAddress)
router.get('/:id', AddressController.getAddress)
router.put('/:id', AddressController.updateAddress)
router.delete('/:id', AddressController.deleteAddress)
router.patch('/:id/default', AddressController.setDefaultAddress)

export default router
