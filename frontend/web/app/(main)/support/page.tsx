// frontend/web/app/(main)/support/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  HelpCircle,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'billing' | 'order' | 'account' | 'other'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  lastMessage: string
  unreadMessages: number
}

export default function SupportPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Mock tickets data
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TICKET-001',
      title: 'Order not delivered',
      description: 'My order #ORD-12345 was supposed to arrive yesterday but hasn\'t shown up yet.',
      category: 'order',
      status: 'open',
      priority: 'high',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      lastMessage: 'We\'re looking into your delivery status.',
      unreadMessages: 2
    },
    {
      id: 'TICKET-002',
      title: 'Payment failed',
      description: 'My payment keeps getting declined even though my card has sufficient funds.',
      category: 'billing',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15'),
      lastMessage: 'Our payment team is investigating the issue.',
      unreadMessages: 0
    },
    {
      id: 'TICKET-003',
      title: 'Website loading issue',
      description: 'The product pages are loading very slowly on my browser.',
      category: 'technical',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      lastMessage: 'Issue has been resolved. Please clear your cache.',
      unreadMessages: 0
    }
  ])

  const categories = [
    { id: 'technical', label: 'Technical', icon: <HelpCircle className="h-4 w-4" />, count: 5 },
    { id: 'billing', label: 'Billing', icon: <FileText className="h-4 w-4" />, count: 3 },
    { id: 'order', label: 'Order', icon: <Package className="h-4 w-4" />, count: 12 },
    { id: 'account', label: 'Account', icon: <User className="h-4 w-4" />, count: 4 },
    { id: 'other', label: 'Other', icon: <HelpCircle className="h-4 w-4" />, count: 2 },
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || ticket.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed': return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">Get help with your orders, account, and more</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Choose how you'd like to get help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat
                <Badge className="ml-auto bg-green-500">Online</Badge>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Us
                <span className="ml-auto text-sm text-gray-500">+1 (555) 123-4567</span>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
                <span className="ml-auto text-sm text-gray-500">support@soko.com</span>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Help</CardTitle>
              <CardDescription>Common questions and solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/help/orders" className="block text-sm hover:text-primary">
                ↳ Order Tracking & Status
              </Link>
              <Link href="/help/returns" className="block text-sm hover:text-primary">
                ↳ Returns & Refunds
              </Link>
              <Link href="/help/payments" className="block text-sm hover:text-primary">
                ↳ Payment Issues
              </Link>
              <Link href="/help/shipping" className="block text-sm hover:text-primary">
                ↳ Shipping & Delivery
              </Link>
              <Link href="/help/account" className="block text-sm hover:text-primary">
                ↳ Account & Security
              </Link>
              <Link href="/faq" className="block text-sm hover:text-primary">
                ↳ View All FAQs
              </Link>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">11:00 AM - 5:00 PM</span>
                </div>
                <div className="pt-2 border-t text-xs text-gray-500">
                  All times are in your local timezone
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tickets */}
        <div className="lg:col-span-2">
          {/* Create New Ticket */}
          <Card className="mb-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Need help with something?</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Create a support ticket and our team will get back to you within 24 hours
                  </p>
                </div>
                <Link href="/support/new-ticket">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Ticket
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* My Tickets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Support Tickets</CardTitle>
                  <CardDescription>
                    Track your ongoing support requests
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      className="pl-10 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Tickets</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <Link 
                        key={ticket.id} 
                        href={`/support/tickets/${ticket.id}`}
                        className="block"
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getStatusIcon(ticket.status)}
                                  <h4 className="font-medium">{ticket.title}</h4>
                                  <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                    {ticket.priority}
                                  </Badge>
                                  <Badge variant="outline">
                                    {ticket.category}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {ticket.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {ticket.createdAt.toLocaleDateString()}
                                    </span>
                                    <span>Ticket #{ticket.id}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {ticket.unreadMessages > 0 && (
                                      <Badge className="bg-blue-500">
                                        {ticket.unreadMessages} new
                                      </Badge>
                                    )}
                                    <span className="text-xs">
                                      Last updated: {ticket.updatedAt.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tickets found
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery 
                          ? 'Try adjusting your search terms'
                          : 'You haven\'t created any support tickets yet'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">How do I track my order?</h4>
                  <p className="text-gray-600 text-sm">
                    You can track your order from the "My Orders" page. A tracking number will be 
                    provided once your order ships.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">What is your return policy?</h4>
                  <p className="text-gray-600 text-sm">
                    We offer a 30-day return policy for most items. Items must be in original 
                    condition with tags attached.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">How long does shipping take?</h4>
                  <p className="text-gray-600 text-sm">
                    Standard shipping takes 3-7 business days. Express shipping is available 
                    for 1-3 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I change my delivery address?</h4>
                  <p className="text-gray-600 text-sm">
                    You can change your delivery address before the order ships from the 
                    order details page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Add missing icon
const Package = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)