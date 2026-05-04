import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}

interface ReviewSectionProps {
  productId: string
  reviews?: Review[]
}

export function ReviewSection({ productId, reviews = [] }: ReviewSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{review.user}</span>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form className="space-y-4">
              <Textarea placeholder="Write your review here..." />
              <div className="flex items-center space-x-2">
                <span className="text-sm">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Star className="w-5 h-5 text-yellow-400" />
                    </Button>
                  ))}
                </div>
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}