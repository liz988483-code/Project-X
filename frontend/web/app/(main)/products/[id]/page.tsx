import { notFound } from 'next/navigation'
import { ReviewSection } from '@/components/products/ReviewSection'
import { ProductImages } from '@/components/products/ProductImages'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'

// Mock data - replace with actual API call
async function getProduct(id: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const products = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with premium sound quality. Features Bluetooth 5.2, 30-hour battery life, and premium leather ear cups.',
      price: 299.99,
      originalPrice: 349.99,
      discount: 15,
      category: 'Electronics',
      subcategory: 'Audio',
      brand: 'AudioPro',
      rating: 4.5,
      reviewCount: 128,
      stock: 45,
      images: ['/images/products/headphones-1.jpg', '/images/products/headphones-2.jpg'],
      specifications: {
        'Bluetooth Version': '5.2',
        'Battery Life': '30 hours',
        'Noise Cancellation': 'Active',
        'Driver Size': '40mm',
        'Weight': '265g'
      },
      shippingInfo: {
        freeShipping: true,
        estimatedDelivery: '2-3 business days',
        returnPolicy: '30-day return policy'
      },
      seller: {
        id: 'seller-1',
        name: 'Audio Store',
        rating: 4.8,
        totalSales: 1245
      }
    }
  ]
  
  return products.find(p => p.id === id)
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.category, href: `/category/${product.category.toLowerCase()}` },
            {
              label: product.name,
              href: ''
            }
          ]}
        />

        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <ProductImages images={product.images} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                    Save {product.discount}%
                  </span>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              product.stock > 10 
                ? 'bg-green-100 text-green-800' 
                : product.stock > 0 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 
                ? 'In Stock' 
                : product.stock > 0 
                ? `Only ${product.stock} left` 
                : 'Out of Stock'
              }
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
              <Button size="lg" variant="ghost">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Seller Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Sold by</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-medium">{product.seller.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⭐ {product.seller.rating}</span>
                    <span>•</span>
                    <span>{product.seller.totalSales} sales</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Shipping & Returns</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Free shipping:</span>
                  <span>{product.shippingInfo.freeShipping ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Estimated delivery:</span>
                  <span>{product.shippingInfo.estimatedDelivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Return policy:</span>
                  <span>{product.shippingInfo.returnPolicy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b last:border-b-0">
                    <td className="px-6 py-4 font-medium text-gray-900">{key}</td>
                    <td className="px-6 py-4 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <ReviewSection productId={params.id} />
        </div>
      </div>
    </div>
  )
}