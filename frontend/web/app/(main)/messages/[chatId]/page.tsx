'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Phone, 
  VideoIcon, 
  Info, 
  Send, 
  Paperclip, 
  Image, 
  Video, 
  Smile,
  MoreVertical,
  Search,
  User,
  Store,
  Star,
  Package,
  Truck,
  Shield,
  Check,
  CheckCheck,
  Clock,
  X,
  Download,
  Copy
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  date: string
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file' | 'product'
  attachments?: string[]
  product?: {
    id: string
    name: string
    price: number
    image: string
  }
}

interface ChatUser {
  id: string
  name: string
  avatar: string
  isSeller: boolean
  rating: number
  totalSales?: number
  totalReviews?: number
  responseRate: string
  avgResponseTime: string
  memberSince: string
  location: string
  online: boolean
  lastSeen: string
}

interface Order {
  id: string
  productName: string
  price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.chatId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')

  const [user, setUser] = useState<ChatUser>({
    id: '1',
    name: 'TechGadgets Store',
    avatar: '',
    isSeller: true,
    rating: 4.8,
    totalSales: 1245,
    totalReviews: 342,
    responseRate: '98%',
    avgResponseTime: '5 minutes',
    memberSince: '2022',
    location: 'Nairobi, Kenya',
    online: true,
    lastSeen: 'online'
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'user',
      content: 'Hi, I\'m interested in the wireless headphones you have listed.',
      timestamp: '10:15 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      senderId: 'current',
      content: 'Hello! Yes, they\'re available. What would you like to know?',
      timestamp: '10:18 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      senderId: 'user',
      content: 'Do they have active noise cancellation?',
      timestamp: '10:20 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      senderId: 'current',
      content: 'Yes, they feature hybrid active noise cancellation with 3 modes.',
      timestamp: '10:22 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      senderId: 'user',
      content: 'Perfect! And what about battery life?',
      timestamp: '10:25 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '6',
      senderId: 'current',
      content: 'Up to 30 hours with ANC on, and 40 hours with ANC off.',
      timestamp: '10:28 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '7',
      senderId: 'user',
      content: 'Great! Can you share more product photos?',
      timestamp: '10:30 AM',
      date: 'Today',
      status: 'delivered',
      type: 'text'
    },
    {
      id: '8',
      senderId: 'current',
      content: '',
      timestamp: '10:32 AM',
      date: 'Today',
      status: 'read',
      type: 'image',
      attachments: ['/images/products/headphones-1.jpg', '/images/products/headphones-2.jpg']
    },
    {
      id: '9',
      senderId: 'current',
      content: 'Here are some additional photos from different angles.',
      timestamp: '10:32 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '10',
      senderId: 'user',
      content: 'Looks good! What\'s your best price for these?',
      timestamp: '10:35 AM',
      date: 'Today',
      status: 'delivered',
      type: 'text'
    },
    {
      id: '11',
      senderId: 'current',
      content: 'I can offer them for $279.99 (original price $299.99)',
      timestamp: '10:38 AM',
      date: 'Today',
      status: 'read',
      type: 'text'
    },
    {
      id: '12',
      senderId: 'current',
      content: '',
      timestamp: '10:38 AM',
      date: 'Today',
      status: 'read',
      type: 'product',
      product: {
        id: '123',
        name: 'Premium Wireless Headphones',
        price: 279.99,
        image: '/images/products/headphones.jpg'
      }
    }
  ])

  const [sharedOrders, setSharedOrders] = useState<Order[]>([
    {
      id: 'ORD-78945',
      productName: 'Premium Wireless Headphones',
      price: 279.99,
      status: 'processing',
      date: '2024-01-15'
    },
    {
      id: 'ORD-78944',
      productName: 'Smart Watch Series 5',
      price: 199.99,
      status: 'delivered',
      date: '2024-01-10'
    }
  ])

  const [sharedFiles, setSharedFiles] = useState([
    { id: '1', name: 'product-specs.pdf', size: '2.4 MB', date: '2024-01-15' },
    { id: '2', name: 'warranty-certificate.pdf', size: '1.8 MB', date: '2024-01-15' },
    { id: '3', name: 'headphone-colors.jpg', size: '4.2 MB', date: '2024-01-15' }
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      status: 'sent',
      type: 'text'
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage('')

    // Simulate typing indicator
    setIsTyping(true)
    
    // Simulate reply after delay
    setTimeout(() => {
      setIsTyping(false)
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'user',
        content: 'Thanks! I\'ll think about it and get back to you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        status: 'delivered',
        type: 'text'
      }
      setMessages(prev => [...prev, reply])
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return timestamp
  }

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      if (!groups[message.date]) {
        groups[message.date] = []
      }
      groups[message.date].push(message)
    })
    
    return groups
  }

  const renderMessage = (message: Message) => {
    if (message.type === 'image') {
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {message.attachments?.map((img, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === 'product') {
      return (
        <div className="border rounded-lg p-3 bg-white">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{message.product?.name}</h4>
              <p className="text-lg font-bold text-gray-900 mt-1">${message.product?.price}</p>
              <Button size="sm" className="mt-2">View Product</Button>
            </div>
          </div>
        </div>
      )
    }

    return <p className="whitespace-pre-wrap">{message.content}</p>
  }

  const messageGroups = groupMessagesByDate()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/messages">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chat Window */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {user.online && (
                      <div className="absolute -bottom-1 -right-1">
                        <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{user.name}</h2>
                      {user.isSeller && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          Seller
                        </Badge>
                      )}
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium ml-1">{user.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {user.online ? 'Online' : `Last seen ${user.lastSeen}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <VideoIcon className="h-5 w-5" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Chat Details</DialogTitle>
                        <DialogDescription>
                          Information about this conversation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.location}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div>
                                <p className="text-sm font-medium">Response Rate</p>
                                <p className="text-lg font-bold">{user.responseRate}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Avg. Response</p>
                                <p className="text-lg font-bold">{user.avgResponseTime}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Member Since</p>
                            <p className="text-gray-600">{user.memberSince}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Total Reviews</p>
                            <p className="text-gray-600">{user.totalReviews}</p>
                          </div>
                          {user.isSeller && (
                            <>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Total Sales</p>
                                <p className="text-gray-600">{user.totalSales?.toLocaleString()}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Rating</p>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="ml-1 font-medium">{user.rating}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                  <div key={date}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center my-6">
                      <div className="px-4 py-1 bg-gray-100 rounded-full">
                        <span className="text-sm font-medium text-gray-600">{date}</span>
                      </div>
                    </div>

                    {/* Messages for this date */}
                    <div className="space-y-4">
                      {dateMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[80%]">
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                message.senderId === 'current'
                                  ? 'bg-blue-500 text-white rounded-br-none'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              {renderMessage(message)}
                              <div className={`flex items-center justify-end gap-1 mt-2 ${
                                message.senderId === 'current' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                <span className="text-xs">{formatMessageTime(message.timestamp)}</span>
                                {message.senderId === 'current' && (
                                  <span className="ml-1">{getStatusIcon(message.status)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <div className="border rounded-2xl p-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full border-0 focus:ring-0 resize-none p-3 min-h-[60px] max-h-[120px]"
                      rows={1}
                    />
                    <div className="flex items-center justify-between px-3 pb-2">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Package className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Share Product</DialogTitle>
                              <DialogDescription>
                                Select a product to share in this conversation
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Wireless Headphones</h4>
                                  <p className="text-lg font-bold text-gray-900">$279.99</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Smart Watch Series 5</h4>
                                  <p className="text-lg font-bold text-gray-900">$199.99</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-12 w-12 rounded-full"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Chat Details */}
        <div className="space-y-6">
          {/* Tabs for additional info */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="chat">Chat Info</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Chat Started</span>
                      <span className="font-medium">Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Messages</span>
                      <span className="font-medium">{messages.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="font-medium">{user.avgResponseTime}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Create Order
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Truck className="h-4 w-4 mr-2" />
                        Share Tracking
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders" className="p-4">
                  <div className="space-y-3">
                    {sharedOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{order.productName}</h4>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'processing' ? 'secondary' :
                            'outline'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Order #{order.id}</span>
                          <span className="font-bold">${order.price}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            View
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Share New Order
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="files" className="p-4">
                  <div className="space-y-3">
                    {sharedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Paperclip className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Seller Stats */}
          {user.isSeller && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Seller Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="font-bold text-green-600">{user.responseRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Response Time</span>
                    <span className="font-bold">{user.avgResponseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Sales</span>
                    <span className="font-bold">{user.totalSales?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold ml-1">{user.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Chat Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Keep conversations professional and respectful</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Share product links for accurate information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use the order feature for official transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Report any suspicious activity immediately</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}