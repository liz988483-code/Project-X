import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Star, Package, MapPin } from 'lucide-react'

interface SellerCardProps {
  seller: {
    id: string
    name: string
    rating: number
    totalProducts: number
    location?: string
    description?: string
  }
}

export default function SellerCard({ seller }: SellerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`/api/placeholder/64/64`} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{seller.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{seller.rating}</span>
                  </div>
                  {seller.location && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{seller.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">View Store</Button>
            </div>
            
            {seller.description && (
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                {seller.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="h-4 w-4" />
                <span className="text-sm">{seller.totalProducts} products</span>
              </div>
              <Button size="sm">Follow</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}