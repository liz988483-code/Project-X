'use client'
import { useState } from 'react'
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Building, 
  User,
  MapPin,
  Phone,
  Mail,
  Shield,
  Truck,
  CheckCircle,
  Lock,
  LucideIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'

interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 0, days: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '1-2 business days' },
    { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Ready in 2 hours' },
  ]

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'mobile', name: 'Mobile Money', icon: Wallet },
    { id: 'bank', name: 'Bank Transfer', icon: Building },
  ]

  const orderSummary = {
    items: [
      { name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 },
      { name: 'Designer T-Shirt Collection', quantity: 2, price: 49.99 },
    ],
    subtotal: 399.97,
    shipping: 0,
    tax: 63.99,
    total: 463.96
  }

  const shippingAddress = {
    name: 'John Doe',
    address: '123 Main Street, Westlands',
    city: 'Nairobi',
    state: 'Nairobi County',
    country: 'Kenya',
    postalCode: '00100',
    phone: '+254 712 345 678',
    email: 'john@example.com'
  }

  // Get the selected payment method
  const selectedPaymentMethod = paymentMethods.find((m: PaymentMethod) => m.id === paymentMethod)
  const selectedShippingMethod = shippingMethods.find((m) => m.id === shippingMethod)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your purchase securely</p>
          </div>
          <Badge variant="outline" className="text-lg">
            ${orderSummary.total.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Checkout Steps */}
      <CheckoutSteps currentStep={step} steps={[]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your delivery details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <Button variant="ghost" size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Change
                      </Button>
                    </div>
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{shippingAddress.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{shippingAddress.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{shippingAddress.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{shippingAddress.email}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="font-semibold mb-4">Shipping Method</h3>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      {shippingMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 mb-2 hover:bg-gray-50">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <span className="font-semibold">
                                {method.price === 0 ? 'Free' : `$${method.price}`}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{method.days}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <h3 className="font-semibold mb-4">Special Instructions (Optional)</h3>
                    <Textarea 
                      placeholder="Add delivery instructions, notes, or requests..."
                      rows={3}
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Link href="/cart">
                      <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Cart
                      </Button>
                    </Link>
                    <Button onClick={() => setStep('payment')}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 mb-2 hover:bg-gray-50">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <method.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                  {method.name}
                                </Label>
                                {method.id === 'card' && (
                                  <p className="text-sm text-gray-600">Visa, MasterCard, American Express</p>
                                )}
                                {method.id === 'mobile' && (
                                  <p className="text-sm text-gray-600">M-Pesa, Airtel Money, T-Kash</p>
                                )}
                                {method.id === 'bank' && (
                                  <p className="text-sm text-gray-600">Direct bank transfer</p>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline">Secure</Badge>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Card Details (if card selected) */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Card Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="John Doe" />
                        </div>
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" type="password" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Money Details */}
                  {paymentMethod === 'mobile' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Mobile Money Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="provider">Provider</Label>
                          <select id="provider" className="w-full border rounded-lg p-2">
                            <option>M-Pesa</option>
                            <option>Airtel Money</option>
                            <option>T-Kash</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="0712 345 678" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms & Conditions and Privacy Policy
                    </Label>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={() => setStep('shipping')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Shipping
                    </Button>
                    <Button 
                      onClick={() => setStep('review')}
                      disabled={!agreeToTerms}
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
                <CardDescription>Confirm your purchase details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {orderSummary.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Shipping Information</h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep('shipping')}>
                        Edit
                      </Button>
                    </div>
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Shipping Address</p>
                            <p className="font-medium">{shippingAddress.name}</p>
                            <p className="text-sm">{shippingAddress.address}</p>
                            <p className="text-sm">{shippingAddress.city}, {shippingAddress.country}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Shipping Method</p>
                            <p className="font-medium">
                              {selectedShippingMethod?.name}
                            </p>
                            <p className="text-sm">
                              {selectedShippingMethod?.days}
                            </p>
                            <p className="text-sm font-medium">
                              {selectedShippingMethod?.price === 0 
                                ? 'Free' 
                                : `$${selectedShippingMethod?.price}`
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Payment Information</h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep('payment')}>
                        Edit
                      </Button>
                    </div>
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {selectedPaymentMethod?.icon && (
                                <selectedPaymentMethod.icon className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {selectedPaymentMethod?.name}
                              </p>
                              {paymentMethod === 'card' && (
                                <p className="text-sm text-gray-600">Ending in •••• 3456</p>
                              )}
                            </div>
                          </div>
                          <Badge>
                            <Lock className="h-3 w-3 mr-1" />
                            Secure
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>256-bit SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>Free Returns</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Buyer Protection</span>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={() => setStep('payment')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Payment
                    </Button>
                    <Button size="lg" className="px-8">
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Items ({orderSummary.items.length})</h4>
                <div className="space-y-2">
                  {orderSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="pt-6 border-t">
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">
                      {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Questions?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available 24/7
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-sm">
                    Live Chat
                  </Button>
                  <Button variant="ghost" className="w-full text-sm">
                    Call: +254 700 123 456
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}