'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, ThumbsUp, AlertCircle, Plus } from 'lucide-react'

const feedbackData = [
  {
    id: 1,
    tracking: 'TRK-2026-0001',
    date: '2026-04-01',
    rating: 5,
    category: 'on_time',
    comment: 'Delivery was on time and package was well handled. Great service!',
    driverName: 'Jean Dupont',
  },
  {
    id: 2,
    tracking: 'TRK-2026-0002',
    date: '2026-03-30',
    rating: 4,
    category: 'quality',
    comment: 'Good service but packaging could be better.',
    driverName: 'Marie Leclerc',
  },
  {
    id: 3,
    tracking: 'TRK-2026-0003',
    date: '2026-03-28',
    rating: 5,
    category: 'environment',
    comment: 'Impressed by the use of electric vehicles! Very eco-friendly.',
    driverName: 'Pierre Moreau',
  },
  {
    id: 4,
    tracking: 'TRK-2026-0004',
    date: '2026-03-25',
    rating: 3,
    category: 'communication',
    comment: 'Driver did not provide tracking updates during delivery.',
    driverName: 'Sophie Bernard',
  },
]

export default function ClientFeedbackPage() {
  const [filterRating, setFilterRating] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredFeedback = feedbackData.filter((f) => {
    if (filterRating === 'all') return true
    return f.rating === parseInt(filterRating)
  })

  const averageRating = (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)
  const ratingCounts = {
    5: feedbackData.filter((f) => f.rating === 5).length,
    4: feedbackData.filter((f) => f.rating === 4).length,
    3: feedbackData.filter((f) => f.rating === 3).length,
    2: feedbackData.filter((f) => f.rating === 2).length,
    1: feedbackData.filter((f) => f.rating === 1).length,
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'on_time':
        return 'bg-green-900/30 text-green-400 border-green-700/50'
      case 'quality':
        return 'bg-blue-900/30 text-blue-400 border-blue-700/50'
      case 'environment':
        return 'bg-primary/20 text-primary'
      case 'communication':
        return 'bg-amber-900/30 text-amber-400 border-amber-700/50'
      default:
        return 'bg-muted/30'
    }
  }

  return (
    <DashboardLayout title="Delivery Feedback">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(parseFloat(averageRating)) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Average rating from {feedbackData.length} deliveries</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                {Object.entries(ratingCounts).reverse().map(([rating, count]) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(parseInt(rating))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / feedbackData.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feedback History</CardTitle>
                <CardDescription>Reviews from your recent deliveries</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Submit Feedback</DialogTitle>
                    <DialogDescription>Share your delivery experience</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Select Delivery</FieldLabel>
                        <select className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-md">
                          <option>TRK-2026-0042</option>
                          <option>TRK-2026-0041</option>
                          <option>TRK-2026-0040</option>
                        </select>
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Rating</FieldLabel>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="p-2 hover:scale-110 transition-transform"
                            >
                              <Star className="w-6 h-6 fill-primary text-primary" />
                            </button>
                          ))}
                        </div>
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Category</FieldLabel>
                        <select className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-md">
                          <option>On-time delivery</option>
                          <option>Quality of service</option>
                          <option>Environmental impact</option>
                          <option>Communication</option>
                        </select>
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Comments</FieldLabel>
                        <Textarea placeholder="Share your feedback..." className="bg-muted/50 min-h-24" />
                      </Field>
                    </FieldGroup>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Submit Feedback
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <select
                className="px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{feedback.tracking}</p>
                      <p className="text-xs text-muted-foreground mt-1">Driver: {feedback.driverName} • {feedback.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < feedback.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feedback.comment}</p>
                  <Badge variant="outline" className={getCategoryColor(feedback.category)}>
                    {feedback.category.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
