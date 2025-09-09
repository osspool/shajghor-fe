import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Scissors, 
  Copy, 
  CheckCircle,
  Share2,
  MapPin,
  CreditCard
} from 'lucide-react';
import { bookingApi } from '@/api/platform/booking-api';
import { toast } from 'sonner';



export const BookingConfirmation = ({ booking, onNewBooking, parlourName = "" }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const bookingUrl = bookingApi.generateBookingUrl(booking._id);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setIsCopied(true);
      toast.success("Link Copied!", {
        description: "Booking link has been copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link", {
        description: "Please copy the link manually",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Booking Confirmation - ${booking._id}`,
      text: `My appointment at ${parlourName || 'the parlour'} on ${new Date(booking.appointmentDate).toLocaleDateString('en-GB')} at ${booking.appointmentTime}`,
      url: bookingUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      confirmed: 'default',
      completed: 'default',
      cancelled: 'destructive'
    };
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      paid: 'default',
      refunded: 'destructive'
    };
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your appointment has been successfully booked</p>
        </div>
      </div>

      {/* Booking Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <div className="flex gap-2">
              {getStatusBadge(booking.status)}
              {getPaymentStatusBadge(booking.paymentStatus)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Booking ID */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono text-lg font-semibold">{booking._id}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Scissors className="h-4 w-4" />
              Services
            </div>
            {booking.services.map((service, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div>
                  <span className="font-medium">{service.serviceName}</span>
                  <span className="text-sm text-muted-foreground ml-2">({service.duration} mins)</span>
                </div>
                <span className="font-medium text-primary">৳{service.price}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(booking.appointmentDate).toLocaleDateString('en-GB', { 
                    weekday: 'short', 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{booking.appointmentTime}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{booking.customerPhone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">{booking.paymentMethod}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-primary">৳{booking.totalAmount}</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{booking.serviceType === 'at-home' ? 'At Home Service' : (parlourName || 'Parlour')}</span>
            </div>
            {booking.serviceType === 'at-home' ? (
              <>
                {booking.serviceAddress && (
                  <p className="text-sm text-foreground mb-1">{booking.serviceAddress}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Our staff will visit your address at the preferred time within working hours.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Visit our parlour at the scheduled time. Please arrive 5 minutes early.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
          <Share2 className="w-4 h-4" />
          Share Booking
        </Button>
        <Button onClick={onNewBooking} className="flex-1">
          Book Another Appointment
        </Button>
      </div>

      {/* Shareable Link Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Shareable Booking Link:</p>
            <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm font-mono break-all">
              <span className="flex-1">{bookingUrl}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 w-8 p-0"
              >
                {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link to show your booking status to the parlour or keep it for your records.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};