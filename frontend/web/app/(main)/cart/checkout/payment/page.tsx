'use client'
import { useState } from 'react'
import { 
  CreditCard, 
  Wallet, 
  Building, 
  Shield, 
  Lock,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [showCvv, setShowCvv] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, MasterCard, American Express' },
    { id: 'mobile', name: 'Mobile Money', icon: Wallet, description: 'M-Pesa, Airtel Money, T-Kash' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, description: 'Direct bank transfer' },
  ]

  const mobileProviders = ['M-Pesa', 'Airtel Money', 'T-Kash', 'Equitel']

  const orderSummary = {
    subtotal: 399.97,
    shipping: 0,
    tax: 64.00,
    total: 463.97
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setExpiry(value.slice(0, 5))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600">Complete your purchase securely</p>
          </div>
          <Link href="/cart/checkout/shipping">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shipping
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label 
                        htmlFor={method.id} 
                        className="cursor-pointer flex-1"
                      >
                        <Card className={`border-2 ${paymentMethod === method.id ? 'border-primary' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <method.icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{method.name}</p>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline">
                                <Shield className="h-3 w-3 mr-1" />
                                Secure
                              </Badge>
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

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {paymentMethod === 'card' && 'Card Details'}
                {paymentMethod === 'mobile' && 'Mobile Money Details'}
                {paymentMethod === 'bank' && 'Bank Transfer Details'}
              </CardTitle>
              <CardDescription>
                {paymentMethod === 'card' && 'Enter your card information'}
                {paymentMethod === 'mobile' && 'Enter your mobile money details'}
                {paymentMethod === 'bank' && 'Complete the bank transfer'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative mt-1">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative mt-1">
                        <Input
                          id="cvv"
                          type={showCvv ? "text" : "password"}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showCvv ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                      Save card for future purchases
                    </Label>
                  </div>
                </div>
              )}

              {/* Mobile Money Form */}
              {paymentMethod === 'mobile' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="provider">Mobile Money Provider</Label>
                    <select 
                      id="provider" 
                      className="w-full border rounded-lg p-2 mt-1"
                    >
                      <option value="">Select provider</option>
                      {mobileProviders.map(provider => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0712 345 678"
                    />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      You will receive a prompt on your phone to complete the payment
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Transfer Form */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Bank Transfer Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium">Equity Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium">SOKO Marketplace Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Branch Code:</span>
                        <span className="font-medium">068</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SWIFT Code:</span>
                        <span className="font-medium">EQBLKENA</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reference">Payment Reference</Label>
                    <Input
                      id="reference"
                      placeholder="Your order number or name"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Use this reference when making the transfer
                    </p>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="pt-4 mt-6 border-t">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the Terms & Conditions and authorize SOKO to charge my payment method for the total amount shown. I understand that I can cancel my order within 1 hour of purchase.
                  </Label>
                </div>
              </div>
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

              {/* Security Badges */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>PCI DSS</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Order */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Ready to complete</h3>
                  <p className="text-sm text-gray-600">Review and place your order</p>
                </div>
              </div>
              <Link href="/cart/checkout/review">
                <Button className="w-full" size="lg" disabled={!agreeToTerms}>
                  <Lock className="h-4 w-4 mr-2" />
                  Review Order
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment Security */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="inline-flex p-2 bg-blue-100 rounded-full mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Security</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your payment information is encrypted and secure
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-gray-900">256-bit</div>
                    <div className="text-xs text-gray-600">SSL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-gray-900">PCI</div>
                    <div className="text-xs text-gray-600">DSS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-gray-900">3D</div>
                    <div className="text-xs text-gray-600">Secure</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}