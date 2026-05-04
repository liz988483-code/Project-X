import { notFound } from 'next/navigation'
import StoreHeader from '@/components/sellers/StoreHeader'
import ProductGrid from '@/components/products/ProductGrid'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Star, Shield, Truck } from 'lucide-react'

interface SellerPageProps {
  params: {
    sellerId: string
  }
}

export default function SellerPage({ params }: SellerPageProps) {
  const sellerId = params.sellerId
  
  // Mock seller data
  const seller = {
    id: sellerId,
    name: 'Tech Gadgets Pro',
    description: 'Premium tech gadgets and accessories at affordable prices',
    rating: 4.8,
    totalReviews: 1243,
    joinedDate: '2022',
    totalProducts: 156,
    responseRate: '98%',
    shippingTime: '1-2 days',
    location: 'Nairobi, Kenya'
  }

  if (!sellerId) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoreHeader seller={seller} />
      
      {/* Seller Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Products</div>
                <div className="text-xl font-bold">{seller.totalProducts}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Rating</div>
                <div className="text-xl font-bold">{seller.rating}/5.0</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Response Rate</div>
                <div className="text-xl font-bold">{seller.responseRate}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Shipping</div>
                <div className="text-xl font-bold">{seller.shippingTime}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seller Products */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Products from {seller.name}</h2>
        <ProductGrid sellerId={sellerId} />
      </div>

      {/* About Seller */}
      <Card className="my-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">About This Seller</h3>
          <p className="text-gray-600 mb-4">{seller.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Joined</div>
              <div className="font-medium">{seller.joinedDate}</div>
            </div>
            <div>
              <div className="text-gray-500">Total Reviews</div>
              <div className="font-medium">{seller.totalReviews}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}