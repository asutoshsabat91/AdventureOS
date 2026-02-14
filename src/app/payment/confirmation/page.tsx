'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import AuthCheck from '@/components/auth-check'
import { 
  CheckCircle,
  AlertCircle,
  Download,
  Mail,
  Smartphone,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Plane,
  Hotel,
  Mountain,
  MapPin,
  Star,
  Share2,
  Home
} from 'lucide-react'

export default function PaymentConfirmationPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Retrieve booking data from localStorage
    const storedBooking = localStorage.getItem('latestBooking')
    if (storedBooking) {
      setBookingData(JSON.parse(storedBooking))
    }
    setLoading(false)
  }, [])

  const handleDownloadTicket = () => {
    // Simulate ticket download
    alert('Downloading your ticket...')
  }

  const handleEmailTicket = () => {
    // Simulate email ticket
    alert('Ticket has been sent to your email!')
  }

  const handleShareBooking = () => {
    // Simulate share functionality
    if (navigator.share) {
      navigator.share({
        title: 'AdventureOS Booking Confirmation',
        text: `I just booked ${bookingData?.title} with AdventureOS!`,
        url: window.location.href
      })
    } else {
      alert('Sharing link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthCheck>
    )
  }

  if (!bookingData) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <Navigation activePage="payment" />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
              <p className="text-lg text-gray-600 mb-8">
                We couldn't find your booking details. Please check your booking confirmation email.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <Navigation activePage="payment" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">Your adventure is all set. Get ready for an amazing experience!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Confirmation Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Details */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {bookingData.type === 'flight' && <Plane className="h-5 w-5" />}
                      {bookingData.type === 'hotel' && <Hotel className="h-5 w-5" />}
                      {bookingData.type === 'adventure' && <Mountain className="h-5 w-5" />}
                      Booking Details
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Confirmed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-xl">{bookingData.title}</h3>
                    <p className="text-gray-600">{bookingData.provider}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{bookingData.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{bookingData.passengers} Passenger(s)</span>
                    </div>
                  </div>

                  {bookingData.type === 'flight' && (
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flight Number:</span>
                        <span className="font-medium">{bookingData.details.flight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-medium">{bookingData.details.departure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrival:</span>
                        <span className="font-medium">{bookingData.details.arrival}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{bookingData.details.duration}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Amount Paid:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{bookingData.price.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Booking ID:</strong> {bookingData.bookingId}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Please save this booking ID for future reference
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">What would you like to do next?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={handleDownloadTicket} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Ticket
                    </Button>
                    <Button onClick={handleEmailTicket} variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Ticket
                    </Button>
                    <Button onClick={handleShareBooking} variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Booking
                    </Button>
                    <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Check-in Timing</p>
                      <p className="text-sm text-gray-600">Please arrive 2 hours before departure for domestic flights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Mobile Check-in</p>
                      <p className="text-sm text-gray-600">You can check in online 48 hours before departure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Terminal Information</p>
                      <p className="text-sm text-gray-600">Terminal details will be sent 24 hours before departure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Base Price:</span>
                    <span>₹{bookingData.price.base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees:</span>
                    <span>₹{bookingData.price.taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Method:</span>
                    <span className="capitalize">{bookingData.paymentMethod}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total Paid:</span>
                      <span className="text-green-600">₹{bookingData.price.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Our customer support team is available 24/7 to assist you.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Call Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Explore More */}
              <Card>
                <CardHeader>
                  <CardTitle>Explore More</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Make your trip even better with these add-ons:
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Hotel className="h-4 w-4 mr-2" />
                      Book Hotels
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mountain className="h-4 w-4 mr-2" />
                      Add Adventures
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Find Travel Partners
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
