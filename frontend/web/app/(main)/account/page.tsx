'use client'
import { useState } from 'react'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut,
  CreditCard,
  Bell,
  Shield,
  Package,
  Check,
  MessageCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254 712 345 678',
    joinedDate: '2023-01-15',
    avatar: '',
    level: 'Gold Member',
    points: 1250,
    nextLevelPoints: 2000,
    verified: true
  })

  const stats = [
    { label: 'Orders', value: '24', icon: ShoppingBag, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Wishlist', value: '18', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100' },
    { label: 'Addresses', value: '3', icon: MapPin, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Reviews', value: '12', icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ]

  const quickActions = [
    { label: 'Edit Profile', icon: User, href: '/account/profile' },
    { label: 'Address Book', icon: MapPin, href: '/account/address-book' },
    { label: 'My Orders', icon: ShoppingBag, href: '/account/orders' },
    { label: 'Wishlist', icon: Heart, href: '/account/wishlist' },
    { label: 'Payment Methods', icon: CreditCard, href: '/account/payment-methods' },
    { label: 'Notifications', icon: Bell, href: '/account/notifications' },
    { label: 'Privacy & Security', icon: Shield, href: '/account/security' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
  ]

  const recentOrders = [
    { id: 'ORD-78945', date: '2024-01-15', total: 249.99, status: 'Delivered', items: 2 },
    { id: 'ORD-78946', date: '2024-01-10', total: 89.99, status: 'Processing', items: 1 },
    { id: 'ORD-78947', date: '2024-01-05', total: 429.99, status: 'Shipped', items: 3 },
  ]

  // Safe progress calculation
  const progressValue = user.nextLevelPoints > 0 
    ? (user.points / user.nextLevelPoints) * 100 
    : 0

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600">Manage your account settings and view your orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your account information and membership status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  {user.verified && (
                    <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                      {user.level}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                  <p className="text-gray-600 mb-4">{user.phone}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Member since {user.joinedDate}</span>
                      <span className="font-medium">{user.points} / {user.nextLevelPoints} points</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {user.nextLevelPoints - user.points} points to next level
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/account/profile">
                      <Button>
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={() => router.push('/')}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {stat.value}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{stat.label}</h3>
                  <p className="text-sm text-gray-500">Total items</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchases</CardDescription>
                </div>
                <Link href="/account/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{order.id}</h4>
                        <Badge variant={
                          order.status === 'Delivered' ? 'default' :
                          order.status === 'Processing' ? 'secondary' :
                          'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()} • {order.items} item(s) • ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
                      <action.icon className="h-5 w-5" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-gray-500">Your email is secure</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Shield className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">2FA Authentication</p>
                      <p className="text-sm text-gray-500">Add extra security</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Last login: Today, 10:30 AM</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Login History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is here to help you
                </p>
                <div className="space-y-2">
                  <Button className="w-full">Contact Support</Button>
                  <Button variant="outline" className="w-full">FAQ</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}