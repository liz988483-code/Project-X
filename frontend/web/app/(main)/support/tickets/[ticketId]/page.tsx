// frontend/web/app/(main)/support/tickets/[ticketId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  Send,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Tag,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth-store'

interface TicketMessage {
  id: string
  content: string
  sender: 'user' | 'support'
  senderName: string
  timestamp: Date
  attachments?: string[]
  isRead: boolean
}

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'billing' | 'order' | 'account' | 'other'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  assignedTo?: {
    id: string
    name: string
    avatar: string
    role: string
  }
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [newMessage, setNewMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const ticketId = params.ticketId as string

  useEffect(() => {
    // Fetch ticket details
    const mockTicket: SupportTicket = {
      id: ticketId,
      title: 'Order not delivered',
      description: 'My order #ORD-12345 was supposed to arrive yesterday but hasn\'t shown up yet. I\'ve checked the tracking and it says delivered, but I haven\'t received anything.',
      category: 'order',
      status: 'open',
      priority: 'high',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      assignedTo: {
        id: 'support_001',
        name: 'Sarah Johnson',
        avatar: '/avatars/support.jpg',
        role: 'Senior Support Agent'
      }
    }

    const mockMessages: TicketMessage[] = [
      {
        id: '1',
        content: 'Hello, I haven\'t received my order #ORD-12345 that was supposed to be delivered yesterday. Can you help?',
        sender: 'user',
        senderName: user?.firstName || 'Customer',
        timestamp: new Date('2024-01-15 14:30'),
        isRead: true
      },
      {
        id: '2',
        content: 'Hi there! I\'m sorry to hear about your order. Let me check the delivery status for you. Can you confirm your shipping address?',
        sender: 'support',
        senderName: 'Sarah Johnson',
        timestamp: new Date('2024-01-15 15:15'),
        isRead: true
      },
      {
        id: '3',
        content: 'My address is 123 Main Street, Apt 4B, New York, NY 10001. The tracking shows delivered but I haven\'t received anything.',
        sender: 'user',
        senderName: user?.firstName || 'Customer',
        timestamp: new Date('2024-01-15 16:45'),
        isRead: true
      },
      {
        id: '4',
        content: 'Thank you for confirming. I can see there was a delivery attempt at 2:30 PM yesterday. Sometimes carriers mark as delivered early. I\'ve requested an investigation with the carrier and will update you within 24 hours.',
        sender: 'support',
        senderName: 'Sarah Johnson',
        timestamp: new Date('2024-01-16 10:30'),
        isRead: false
      }
    ]

    setTicket(mockTicket)
    setMessages(mockMessages)
  }, [ticketId, user])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return

    setIsSubmitting(true)
    
    try {
      // In real app, send to API
      const newMsg: TicketMessage = {
        id: `msg_${Date.now()}`,
        content: newMessage,
        sender: 'user',
        senderName: user?.firstName || 'Customer',
        timestamp: new Date(),
        isRead: false
      }

      setMessages(prev => [...prev, newMsg])
      setNewMessage('')

      // Update ticket
      setTicket(prev => prev ? {
        ...prev,
        updatedAt: new Date(),
        status: 'in-progress'
      } : null)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ticket not found
          </h3>
          <p className="text-gray-600 mb-6">
            The ticket you're looking for doesn't exist or you don't have access.
          </p>
          <Link href="/support">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/support">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Priority</h4>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="capitalize">{ticket.category}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Created</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{ticket.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h4>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{ticket.updatedAt.toLocaleString()}</span>
                </div>
              </div>

              {ticket.assignedTo && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={ticket.assignedTo.avatar} />
                      <AvatarFallback>
                        {ticket.assignedTo.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{ticket.assignedTo.name}</p>
                      <p className="text-sm text-gray-500">{ticket.assignedTo.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Need immediate help?</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Messages */}
        <div className="lg:col-span-2">
          {/* Ticket Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {ticket.title}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {ticket.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Ticket #{ticket.id}</span>
                    <span>•</span>
                    <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={message.sender === 'user' ? user?.avatar : ticket.assignedTo?.avatar} 
                      />
                      <AvatarFallback>
                        {message.senderName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-3 rounded-2xl ${
                        message.sender === 'user' 
                          ? 'bg-primary-100 text-primary-900 rounded-tr-none' 
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3">
                            {message.attachments.map((attachment, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="mr-2 mb-2"
                              >
                                <Paperclip className="h-3 w-3 mr-2" />
                                {attachment}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        {message.timestamp.toLocaleString()}
                        {!message.isRead && message.sender === 'user' && (
                          <span className="ml-2 text-blue-500">• Sent</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="mt-8 pt-6 border-t">
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[100px] mb-4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/support')}>
              Close Ticket
            </Button>
            <Button onClick={() => {/* Mark as resolved */}}>
              Mark as Resolved
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}