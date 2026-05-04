import StoreHeader from '@/components/sellers/StoreHeader'
import ProductGrid from '@/components/products/ProductGrid'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Star, Users, Award } from 'lucide-react'

interface StorePageProps {
  params: {
    sellerId: string
  }
}

export default function StorePage({ params }: StorePageProps) {
  const sellerId = params.sellerId
  
  const seller = {
    id: sellerId,
    name: 'Tech Gadgets Store',
    description: 'Your one-stop shop for all tech gadgets and accessories',
    rating: 4.8,
    totalReviews: 1243,
    joinedDate: '2022',
    totalProducts: 156,
    location: 'Nairobi, Kenya',
    categories: ['Electronics', 'Gadgets', 'Accessories', 'Smart Home']
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{seller.name}</h1>
            <p className="text-xl mb-6">{seller.description}</p>
            <div className="flex flex-wrap gap-4">
              {seller.categories.map((category, index) => (
                <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About Store</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Products</h2>
              <div className="text-sm text-gray-500">
                Showing {seller.totalProducts} products
              </div>
            </div>
            <ProductGrid sellerId={sellerId} />
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Store Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">About Us</h4>
                    <p className="text-gray-600">
                      {seller.name} has been providing quality tech products since {seller.joinedDate}. 
                      We specialize in bringing you the latest gadgets and electronics at competitive prices.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Store Stats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{seller.rating}/5.0 rating ({seller.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span>{seller.totalProducts} products available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>500+ satisfied customers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span>Verified Seller</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <div className="text-center py-12 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No reviews yet. Be the first to review this store!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Shipping Policy</h3>
                  <p className="text-gray-600">
                    We ship nationwide within 1-3 business days. Free shipping on orders over $50.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Return Policy</h3>
                  <p className="text-gray-600">
                    30-day return policy. Products must be in original condition with all accessories.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Contact Information</h3>
                  <p className="text-gray-600">
                    Email: store@example.com<br />
                    Phone: +254 700 000 000<br />
                    Business Hours: Mon-Fri 9AM-5PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}