'use client'
import { useState } from 'react'
import { 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'

interface Address {
  id: number
  name: string
  type: 'home' | 'work' | 'other'
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  isDefault: boolean
}

export default function ShippingPage() {
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  const addresses: Address[] = [
    {
      id: 1,
      name: 'John Doe',
      type: 'home',
      address: '123 Main Street, Westlands',
      city: 'Nairobi',
      state: 'Nairobi County',
      country: 'Kenya',
      postalCode: '00100',
      phone: '+254 712 345 678',
      isDefault: true
    },
    {
      id: 2,
      name: 'John Doe',
      type: 'work',
      address: '456 Business Center, 5th Floor',
      city: 'Nairobi',
      state: 'Nairobi County',
      country: 'Kenya',
      postalCode: '00200',
      phone: '+254 723 456 789',
      isDefault: false
    },
    {
      id: 3,
      name: 'Jane Smith',
      type: 'other',
      address: '789 Family Home, Karen',
      city: 'Nairobi',
      state: 'Nairobi County',
      country: 'Kenya',
      postalCode: '00502',
      phone: '+254 734 567 890',
      isDefault: false
    },
  ]

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 0, days: '3-5 business days', estimated: 'Jan 18-20' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '1-2 business days', estimated: 'Jan 16-17' },
    { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Ready in 2 hours', estimated: 'Today' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Details</h1>
            <p className="text-gray-600">Where should we deliver your order?</p>
          </div>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
              <CardDescription>Select a delivery address or add a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAddress.toString()} onValueChange={(value) => setSelectedAddress(parseInt(value))}>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`address-${address.id}`} 
                          className="cursor-pointer flex-1"
                        >
                          <Card className={`border-2 ${selectedAddress === address.id ? 'border-primary' : ''}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="capitalize">
                                      {address.type}
                                    </Badge>
                                    {address.isDefault && (
                                      <Badge className="bg-green-500">Default</Badge>
                                    )}
                                  </div>
                                  <p className="font-medium">{address.name}</p>
                                  <p className="text-gray-600">{address.address}</p>
                                  <p className="text-gray-600">
                                    {address.city}, {address.state}, {address.country} - {address.postalCode}
                                  </p>
                                  <p className="text-gray-600 mt-2">{address.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {!address.isDefault && (
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Add New Address */}
              <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                      Add a new delivery address to your account
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add address form would go here */}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Method</CardTitle>
              <CardDescription>Choose how you want to receive your order</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label 
                        htmlFor={method.id} 
                        className="cursor-pointer flex-1"
                      >
                        <Card className={`border-2 ${shippingMethod === method.id ? 'border-primary' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  {method.id === 'pickup' ? (
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Truck className="h-5 w-5 text-gray-400" />
                                  )}
                                  <div>
                                    <p className="font-medium">{method.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Clock className="h-3 w-3" />
                                      <span>{method.days}</span>
                                      <span>•</span>
                                      <span>Estimated: {method.estimated}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">
                                  {method.price === 0 ? 'FREE' : `$${method.price}`}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
              <CardDescription>Add any special delivery instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full border rounded-lg p-3 min-h-[100px] resize-none"
                placeholder="e.g., Leave at front door, Call before delivery, Delivery after 5 PM..."
              />
              <p className="text-sm text-gray-500 mt-2">
                These instructions will be shared with the delivery personnel
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal (3 items)</span>
                  <span className="font-medium">$399.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingMethods.find(m => m.id === shippingMethod)?.price === 0 
                      ? 'Free' 
                      : `$${shippingMethods.find(m => m.id === shippingMethod)?.price}`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$64.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${(399.97 + 
                      (shippingMethods.find(m => m.id === shippingMethod)?.price || 0) + 
                      64.00).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="pt-6 border-t">
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">
                      {shippingMethods.find(m => m.id === shippingMethod)?.estimated}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Step */}
          <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Ready to proceed?</h3>
                  <p className="text-sm text-gray-600">Review your order and continue to payment</p>
                </div>
              </div>
              <Link href="/cart/checkout/payment">
                <Button className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Security Badges */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gray-50">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-medium">Secure Payment</p>
                <p className="text-xs text-gray-600">256-bit SSL</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50">
              <CardContent className="p-4 text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs font-medium">Free Returns</p>
                <p className="text-xs text-gray-600">30 Days</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}