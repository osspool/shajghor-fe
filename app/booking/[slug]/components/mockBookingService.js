
// Mock database storage
const mockBookings = new Map();
const mockTransactions = new Map();

// Generate MongoDB-like ObjectId
const generateObjectId = () => {
  return Math.random().toString(36).substr(2, 24).padStart(24, '0');
};

// Generate booking ID with prefix
const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4);
  return `BKG${timestamp}${random}`.toUpperCase();
};



export const mockBookingService = {
  // Create a new booking
  async createBooking(data) {
    const bookingId = generateObjectId();
    const displayId = generateBookingId();
    const now = new Date();
    
    const totalAmount = data.services.reduce((sum, service) => sum + service.price, 0);
    const totalDuration = data.services.reduce((sum, service) => sum + service.duration, 0);
    
    const booking = {
      parlourId: data.parlourId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      services: data.services.map(service => ({
        serviceId: service._id,
        serviceName: service.name,
        price: service.price,
        duration: service.duration,
      })),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      serviceType: data.serviceType || 'in-salon',
      serviceAddress: data.serviceAddress || undefined,
      status: 'confirmed',
      paymentStatus: data.paymentMethod === 'online' ? 'paid' : 'pending',
      paymentMethod: data.paymentMethod,
      totalAmount,
      totalDuration,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    // Store in mock database
    mockBookings.set(bookingId, booking);
    
    // Create transaction if payment is made
    if (data.paymentMethod === 'online') {
      await this.createTransaction({
        parlourId: data.parlourId,
        bookingId: bookingId,
        type: 'income',
        category: 'Booking Payment',
        amount: totalAmount,
        method: 'online',
        reference: displayId,
        notes: `Online payment for booking ${displayId}`,
      });
    }

    return {
      ...booking,
      _id: displayId, // Return display ID for user-facing purposes
    };
  },

  // Get booking by ID
  async getBooking(bookingId) {
    // Handle both internal ID and display ID
    const booking = mockBookings.get(bookingId) || 
      Array.from(mockBookings.values()).find(b => b._id === bookingId);
    
    return booking || null;
  },

  // Create transaction
  async createTransaction(data) {
    const transactionId = generateObjectId();
    const now = new Date();
    
    const transaction = {
      _id: transactionId,
      parlourId: data.parlourId,
      bookingId: data.bookingId,
      type: data.type,
      category: data.category,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      notes: data.notes,
      date: now,
      createdAt: now,
      updatedAt: now,
    };

    mockTransactions.set(transactionId, transaction);
    return transaction;
  },

  // Generate shareable booking URL
  generateBookingUrl(bookingId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/booking/${bookingId}`;
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    const booking = mockBookings.get(bookingId);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date();
    mockBookings.set(bookingId, booking);
    
    return booking;
  },

  // Get all bookings for a parlour
  async getParlourBookings(parlourId) {
    return Array.from(mockBookings.values())
      .filter(booking => booking.parlourId === parlourId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Get today's bookings for parlour dashboard
  async getTodayBookings(parlourId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Array.from(mockBookings.values())
      .filter(booking => 
        booking.parlourId === parlourId &&
        booking.appointmentDate >= today &&
        booking.appointmentDate < tomorrow
      )
      .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  }
};