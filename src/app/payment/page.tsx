'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/navigation'
import AuthCheck from '@/components/auth-check'
import { 
  CreditCard,
  Smartphone,
  Building,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plane,
  Hotel,
  Mountain,
  Calendar,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    netBanking: ''
  })

  // Mock booking data - in real app, this would come from previous page/params
  const bookingData = {
    type: 'flight', // Could be 'flight', 'hotel', 'adventure'
    title: 'Delhi to Mumbai Flight',
    provider: 'IndiGo',
    date: '2024-12-25',
    details: {
      flight: '6E-208',
      departure: '08:00 AM',
      arrival: '10:15 AM',
      duration: '2h 15m'
    },
    price: {
      base: 3999,
      taxes: 580,
      total: 4579
    },
    passengers: 1,
    bookingId: 'ADV' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData({
      ...formData,
      cardNumber: formatted
    })
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      
      // Store booking confirmation
      const bookingConfirmation = {
        ...bookingData,
        paymentMethod: paymentMethod,
        paymentStatus: 'confirmed',
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('latestBooking', JSON.stringify(bookingConfirmation))
      
      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        router.push('/payment/confirmation')
      }, 2000)
    }, 3000)
  }

  const validateForm = () => {
    if (paymentMethod === 'card') {
      return formData.cardNumber && formData.cardName && formData.expiryDate && formData.cvv
    } else if (paymentMethod === 'upi') {
      return formData.upiId
    } else if (paymentMethod === 'netbanking') {
      return formData.netBanking
    }
    return false
  }

  if (paymentSuccess) {
    return (
      <AuthCheck>
        <div className="min-h-screen bg-gray-50">
          <Navigation activePage="payment" />
          
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                  <p className="text-lg text-gray-600 mb-6">
                    Your booking has been confirmed. Redirecting to confirmation page...
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </CardContent>
              </Card>
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
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {bookingData.type === 'flight' && <Plane className="h-5 w-5" />}
                    {bookingData.type === 'hotel' && <Hotel className="h-5 w-5" />}
                    {bookingData.type === 'adventure' && <Mountain className="h-5 w-5" />}
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{bookingData.title}</h3>
                    <p className="text-gray-600">{bookingData.provider}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {bookingData.date}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {bookingData.passengers} Passenger(s)
                  </div>
                  
                  {bookingData.type === 'flight' && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Flight:</span>
                        <span className="font-medium">{bookingData.details.flight}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Departure:</span>
                        <span className="font-medium">{bookingData.details.departure}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Arrival:</span>
                        <span className="font-medium">{bookingData.details.arrival}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span className="font-medium">{bookingData.details.duration}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Price:</span>
                      <span>₹{bookingData.price.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & Fees:</span>
                      <span>₹{bookingData.price.taxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{bookingData.price.total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Booking ID:</strong> {bookingData.bookingId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        className="h-20 flex-col"
                        onClick={() => setPaymentMethod('card')}
                      >
                        <CreditCard className="h-6 w-6 mb-2" />
                        Credit/Debit Card
                      </Button>
                      <Button
                        variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                        className="h-20 flex-col"
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <Smartphone className="h-6 w-6 mb-2" />
                        UPI
                      </Button>
                      <Button
                        variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
                        className="h-20 flex-col"
                        onClick={() => setPaymentMethod('netbanking')}
                      >
                        <Building className="h-6 w-6 mb-2" />
                        Net Banking
                      </Button>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number</label>
                        <Input
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Cardholder Name</label>
                        <Input
                          name="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date</label>
                          <Input
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
                          <Input
                            name="cvv"
                            type="password"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment Form */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">UPI ID</label>
                        <Input
                          name="upiId"
                          placeholder="yourname@upi"
                          value={formData.upiId}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter your UPI ID (e.g., username@ybl, username@okicici)</p>
                      </div>
                    </div>
                  )}

                  {/* Net Banking Form */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Select Bank</label>
                        <select
                          name="netBanking"
                          value={formData.netBanking}
                          onChange={(e) => setFormData({...formData, netBanking: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select your bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="pnb">Punjab National Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Security Badge */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Secure Payment</p>
                        <p className="text-xs text-green-600">Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="text-sm text-gray-600">
                    <p>
                      By completing this payment, you agree to our 
                      <a href="#" className="text-blue-600 hover:underline"> Terms & Conditions</a> and 
                      <a href="#" className="text-blue-600 hover:underline"> Cancellation Policy</a>.
                    </p>
                  </div>

                  {/* Pay Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 text-lg font-semibold"
                    onClick={handlePayment}
                    disabled={!validateForm() || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay ₹{bookingData.price.total.toLocaleString()}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
