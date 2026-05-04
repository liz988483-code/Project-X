'use client'
import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  User,
  MessageSquare,
  Paperclip,
  Image,
  Video,
  Phone,
  VideoIcon,
  Info,
  Send,
  Smile
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Chat {
  id: string
  userId: string
  userName: string
  userAvatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  online: boolean
  typing: boolean
  isSeller: boolean
  lastSeen: string
}

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file'
  attachments?: string[]
}

export default function MessagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: '',
      lastMessage: 'Thanks for the quick response! When can you ship?',
      timestamp: '10:30 AM',
      unreadCount: 3,
      online: true,
      typing: false,
      isSeller: true,
      lastSeen: 'just now'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Johnson',
      userAvatar: '',
      lastMessage: 'I received the package, thank you!',
      timestamp: 'Yesterday',
      unreadCount: 0,
      online: false,
      typing: false,
      isSeller: false,
      lastSeen: '2 hours ago'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'TechGadgets Store',
      userAvatar: '',
      lastMessage: 'Your order has been shipped. Tracking number: TRK-123456',
      timestamp: 'Jan 15',
      unreadCount: 1,
      online: true,
      typing: true,
      isSeller: true,
      lastSeen: 'online'
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Michael Brown',
      userAvatar: '',
      lastMessage: 'Can you provide more details about the product warranty?',
      timestamp: 'Jan 14',
      unreadCount: 0,
      online: false,
      typing: false,
      isSeller: false,
      lastSeen: '1 day ago'
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'FashionHub',
      userAvatar: '',
      lastMessage: 'The item is back in stock! Would you like to purchase?',
      timestamp: 'Jan 12',
      unreadCount: 5,
      online: true,
      typing: false,
      isSeller: true,
      lastSeen: 'online'
    },
    {
      id: '6',
      userId: 'user6',
      userName: 'Emma Wilson',
      userAvatar: '',
      lastMessage: 'The quality is amazing, thank you!',
      timestamp: 'Jan 10',
      unreadCount: 0,
      online: false,
      typing: false,
      isSeller: false,
      lastSeen: '3 days ago'
    },
  ])

  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: '1',
      senderId: 'user1',
      content: 'Hi, I\'m interested in the wireless headphones.',
      timestamp: '10:15 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      chatId: '1',
      senderId: 'current',
      content: 'Hello! Yes, they\'re available. What would you like to know?',
      timestamp: '10:18 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      chatId: '1',
      senderId: 'user1',
      content: 'Do they have noise cancellation?',
      timestamp: '10:20 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      chatId: '1',
      senderId: 'current',
      content: 'Yes, they feature active noise cancellation with 3 modes.',
      timestamp: '10:22 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      chatId: '1',
      senderId: 'user1',
      content: 'Perfect! Thanks for the quick response! When can you ship?',
      timestamp: '10:30 AM',
      status: 'delivered',
      type: 'text'
    },
  ])

  const [newMessage, setNewMessage] = useState('')

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && chat.unreadCount > 0) ||
                      (activeTab === 'sellers' && chat.isSeller) ||
                      (activeTab === 'buyers' && !chat.isSeller)
    return matchesSearch && matchesTab
  })

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const newMsg: Message = {
      id: Date.now().toString(),
      chatId: selectedChat,
      senderId: 'current',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    }

    setMessages(prev => [...prev, newMsg])
    setNewMessage('')

    // Update chat's last message
    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          lastMessage: newMessage,
          timestamp: newMsg.timestamp,
          unreadCount: 0,
          typing: false
        }
      }
      return chat
    }))

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        chatId: selectedChat,
        senderId: selectedChat,
        content: 'I can ship within 24 hours. Would you like to proceed with the order?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        type: 'text'
      }
      setMessages(prev => [...prev, reply])
    }, 2000)
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

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Connect with buyers and sellers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column - Chat List */}
        <div className="lg:col-span-1 flex flex-col">
          {/* Search and Filters */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                      <Badge variant="destructive" className="ml-1">
                        {chats.filter(c => c.unreadCount > 0).length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="sellers">Sellers</TabsTrigger>
                    <TabsTrigger value="buyers">Buyers</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Chat List */}
          <Card className="flex-1">
            <ScrollArea className="h-full">
              <div className="p-2">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedChat === chat.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                      onClick={() => {
                        setSelectedChat(chat.id)
                        // Mark as read when selected
                        if (chat.unreadCount > 0) {
                          setChats(prev => prev.map(c => 
                            c.id === chat.id ? { ...c, unreadCount: 0 } : c
                          ))
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {chat.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute -bottom-1 -right-1">
                              <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{chat.userName}</h3>
                              {chat.isSeller && (
                                <Badge variant="outline" className="text-xs">Seller</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">{chat.timestamp}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {chat.typing ? (
                                <span className="text-blue-500 italic">typing...</span>
                              ) : (
                                chat.lastMessage
                              )}
                            </p>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-blue-500">{chat.unreadCount}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {chat.online ? 'Online' : `Last seen ${chat.lastSeen}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations</h3>
                    <p className="text-gray-600 mb-6">Start a conversation with a seller or buyer</p>
                    <Button>Start New Chat</Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Column - Chat Window */}
        <div className="lg:col-span-2 flex flex-col">
          {selectedChat ? (
            <Card className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {chats.find(c => c.id === selectedChat)?.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {chats.find(c => c.id === selectedChat)?.online && (
                        <div className="absolute -bottom-1 -right-1">
                          <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">
                          {chats.find(c => c.id === selectedChat)?.userName}
                        </h2>
                        {chats.find(c => c.id === selectedChat)?.isSeller && (
                          <Badge variant="outline">Seller</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {chats.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
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
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages
                    .filter(msg => msg.chatId === selectedChat)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.senderId === 'current'
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            message.senderId === 'current' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{message.timestamp}</span>
                            {message.senderId === 'current' && (
                              <span>{getStatusIcon(message.status)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {/* Typing indicator */}
                  {chats.find(c => c.id === selectedChat)?.typing && (
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
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Welcome to Messages</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Select a conversation from the list to start chatting with buyers and sellers.
                  You can discuss products, negotiate prices, and coordinate deliveries.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 border rounded-lg">
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="font-medium">Connect</p>
                    <p className="text-sm text-gray-600">Message sellers directly</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-medium">Negotiate</p>
                    <p className="text-sm text-gray-600">Discuss prices and offers</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Check className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="font-medium">Coordinate</p>
                    <p className="text-sm text-gray-600">Arrange delivery details</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* New Message Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-lg h-14 w-14">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}