import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Calendar, MessageSquare } from 'lucide-react'

interface StoreHeaderProps {
  seller: {
    id: string
    name: string
    description: string
    rating: number
    totalReviews: number
    joinedDate: string
    location?: string
  }
}

export default function StoreHeader({ seller }: StoreHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/api/placeholder/80/80`} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{seller.name}</h1>
              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                <Star className="h-3 w-3 fill-current" />
                <span>{seller.rating}</span>
                <span className="text-gray-500">({seller.totalReviews})</span>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{seller.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {seller.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{seller.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {seller.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Seller
          </Button>
          <Button className="gap-2">
            <Star className="h-4 w-4" />
            Follow Store
          </Button>
        </div>
      </div>
    </div>
  )
}