'use client'
import { useState } from 'react'
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Navigation,
  Phone,
  Mail
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface TrackingEvent {
  id: number
  status: string
  location: string
  timestamp: string
  description: string
  completed: boolean
}

interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled'
  estimatedDelivery: string
  carrier: string
  trackingNumber: string
  deliveryAddress: {
    name: string
    address: string
    city: string
    phone: string
    email: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('')
  const [order, setOrder] = useState<Order>({
    id: 'ORD-78945',
    status: 'out-for-delivery',
    estimatedDelivery: '2024-01-18',
    carrier: 'SOKO Express',
    trackingNumber: 'TRK-123456789',
    deliveryAddress: {
      name: 'John Doe',
      address: '123 Main Street, Westlands',
      city: 'Nairobi, Kenya',
      phone: '+254 712 345 678',
      email: 'john@example.com'
    },
    items: [
      { name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 },
      { name: 'Designer T-Shirt Collection', quantity: 2, price: 49.99 }
    ]
  })

  const trackingEvents: TrackingEvent[] = [
    { id: 1, status: 'Order Placed', location: 'Nairobi Warehouse', timestamp: '2024-01-15 10:30 AM', description: 'Order received and confirmed', completed: true },
    { id: 2, status: 'Processing', location: 'Nairobi Warehouse', timestamp: '2024-01-15 2:45 PM', description: 'Order being prepared for shipment', completed: true },
    { id: 3, status: 'Shipped', location: 'Nairobi Sorting Center', timestamp: '2024-01-16 9:15 AM', description: 'Package left the warehouse', completed: true },
    { id: 4, status: 'In Transit', location: 'Westlands Hub', timestamp: '2024-01-17 11:30 AM', description: 'Package in transit to delivery hub', completed: true },
    { id: 5, status: 'Out for Delivery', location: 'Westlands Area', timestamp: '2024-01-18 8:45 AM', description: 'Package out for delivery today', completed: true },
    { id: 6, status: 'Delivered', location: 'Your Address', timestamp: 'Estimated 2024-01-18 6:00 PM', description: 'Expected delivery by end of day', completed: false },
  ]

  const statusProgress = {
    'pending': 20,
    'processing': 40,
    'shipped': 60,
    'out-for-delivery': 80,
    'delivered': 100,
    'cancelled': 0
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed': return <Package className="h-5 w-5" />
      case 'Processing': return <Package className="h-5 w-5" />
      case 'Shipped': return <Truck className="h-5 w-5" />
      case 'In Transit': return <Navigation className="h-5 w-5" />
      case 'Out for Delivery': return <Truck className="h-5 w-5" />
      case 'Delivered': return <CheckCircle className="h-5 w-5" />
      default: return <Clock className="h-5 w-5" />
    }
  }

  const handleTrack = () => {
    if (trackingId.trim()) {
      // In a real app, you would fetch tracking info from an API
      console.log('Tracking:', trackingId)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-gray-600">Real-time updates on your delivery status</p>
      </div>

      {/* Tracking Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Label className="text-sm font-medium mb-2">Enter Tracking Number</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter your tracking number (e.g., TRK-123456789)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="mt-2 md:mt-6">
              <Button onClick={handleTrack} className="w-full md:w-auto">
                Track Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tracking Timeline */}
        <div className="lg:col-span-2">
          {/* Order Status */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Tracking #{order.trackingNumber}</CardDescription>
                </div>
                <Badge variant={
                  order.status === 'delivered' ? 'default' :
                  order.status === 'cancelled' ? 'destructive' :
                  'outline'
                }>
                  {order.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Delivery Progress</span>
                    <span>{statusProgress[order.status]}%</span>
                  </div>
                  <Progress value={statusProgress[order.status]} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Order placed</span>
                  <span className="text-gray-600">Estimated delivery</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>Jan 15, 2024</span>
                  <span>{order.estimatedDelivery}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
              <CardDescription>Real-time updates on your package journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Timeline events */}
                <div className="space-y-8">
                  {trackingEvents.map((event, index) => (
                    <div key={event.id} className="relative flex items-start">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                        event.completed 
                          ? 'bg-green-100 border-2 border-green-300' 
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}>
                        {getStatusIcon(event.status)}
                      </div>
                      
                      {/* Event content */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{event.status}</h3>
                          <span className="text-sm text-gray-500">{event.timestamp}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        
                        {/* Connector line for last item */}
                        {index < trackingEvents.length - 1 && (
                          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Next update expected soon</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order & Delivery Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carrier</p>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{order.carrier}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{order.trackingNumber}</p>
                    <Button variant="ghost" size="sm">Copy</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Items in Shipment</p>
                  <div className="mt-2 space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{order.deliveryAddress.name}</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress.address}</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{order.deliveryAddress.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{order.deliveryAddress.email}</span>
                </div>
                <Separator />
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Delivery Instructions</p>
                      <p className="text-xs text-yellow-700">
                        Please ensure someone is available to receive the package between 9 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="inline-flex p-2 bg-blue-100 rounded-full mb-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our delivery support team
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Call Support
                  </Button>
                  <Button variant="ghost" className="w-full text-sm">
                    Live Chat
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

// Label component for tracking
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  )
}