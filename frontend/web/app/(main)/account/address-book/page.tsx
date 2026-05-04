'use client'
import { useState } from 'react'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Briefcase,
  Check,
  X,
  Phone
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<Address[]>([
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
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    type: 'home',
    address: '',
    city: '',
    state: '',
    country: 'Kenya',
    postalCode: '',
    phone: '',
    isDefault: false
  })

  const handleAddAddress = () => {
    if (newAddress.isDefault) {
      // Remove default from other addresses
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })))
    }
    
    const addressToAdd = {
      ...newAddress,
      id: addresses.length + 1
    }
    
    setAddresses(prev => [...prev, addressToAdd])
    setNewAddress({
      name: '',
      type: 'home',
      address: '',
      city: '',
      state: '',
      country: 'Kenya',
      postalCode: '',
      phone: '',
      isDefault: false
    })
    setIsAdding(false)
  }

  const handleEditAddress = (id: number) => {
    const address = addresses.find(addr => addr.id === id)
    if (address) {
      setNewAddress(address)
      setEditingId(id)
      setIsAdding(true)
    }
  }

  const handleUpdateAddress = () => {
    if (editingId && newAddress.isDefault) {
      // Remove default from other addresses
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })))
    }
    
    setAddresses(prev => prev.map(addr => 
      addr.id === editingId ? { ...newAddress, id: editingId } : addr
    ))
    
    setNewAddress({
      name: '',
      type: 'home',
      address: '',
      city: '',
      state: '',
      country: 'Kenya',
      postalCode: '',
      phone: '',
      isDefault: false
    })
    setEditingId(null)
    setIsAdding(false)
  }

  const handleDeleteAddress = (id: number) => {
    const addressToDelete = addresses.find(addr => addr.id === id)
    if (addressToDelete?.isDefault && addresses.length > 1) {
      // If deleting default, make another address default
      const otherAddress = addresses.find(addr => addr.id !== id)
      if (otherAddress) {
        setAddresses(prev => prev
          .filter(addr => addr.id !== id)
          .map((addr, index) => ({ 
            ...addr, 
            isDefault: index === 0 
          }))
        )
      }
    } else {
      setAddresses(prev => prev.filter(addr => addr.id !== id))
    }
  }

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />
      case 'work': return <Briefcase className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Home'
      case 'work': return 'Work'
      default: return 'Other'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
            <p className="text-gray-600">Manage your delivery addresses</p>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogDescription>
                  {editingId 
                    ? 'Update your address details'
                    : 'Add a new delivery address to your account'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Address Type</Label>
                    <Select 
                      value={newAddress.type} 
                      onValueChange={(value: 'home' | 'work' | 'other') => 
                        setNewAddress(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter street address"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state or province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={newAddress.country} 
                      onValueChange={(value) => 
                        setNewAddress(prev => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                        <SelectItem value="Uganda">Uganda</SelectItem>
                        <SelectItem value="Tanzania">Tanzania</SelectItem>
                        <SelectItem value="Rwanda">Rwanda</SelectItem>
                        <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="Enter postal code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <input
                      type="checkbox"
                      id="default"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="default" className="cursor-pointer">
                      Set as default address
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                  setNewAddress({
                    name: '',
                    type: 'home',
                    address: '',
                    city: '',
                    state: '',
                    country: 'Kenya',
                    postalCode: '',
                    phone: '',
                    isDefault: false
                  })
                }}>
                  Cancel
                </Button>
                <Button onClick={editingId ? handleUpdateAddress : handleAddAddress}>
                  {editingId ? 'Update Address' : 'Add Address'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <Card 
            key={address.id} 
            className={`relative ${address.isDefault ? 'border-primary border-2' : ''}`}
          >
            {address.isDefault && (
              <Badge className="absolute -top-2 -right-2 bg-primary">
                Default
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(address.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{getTypeLabel(address.type)}</CardTitle>
                    <CardDescription>{address.name}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditAddress(address.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!address.isDefault && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.country} - {address.postalCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{address.phone}</span>
                </div>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <Check className="h-3 w-3 mr-2" />
                    Set as Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Addresses Yet</h3>
            <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Address Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure your address is accurate for successful deliveries</li>
                <li>• Include landmarks to help delivery personnel find your location</li>
                <li>• Keep your phone number updated for delivery updates</li>
                <li>• Set a default address for faster checkout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}