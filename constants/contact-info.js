/**
 * Contact information constants for the digital store
 * Used across the application for consistent contact details
 */

export const ContactInfo = {
  // WhatsApp contact number with international format
  WHATSAPP_NUMBER: "+601154240130", // Replace with your actual WhatsApp number
  
  // WhatsApp message template (optional)
  WHATSAPP_MESSAGE: "Hello! I'm interested in your digital products.",
  
  // Email addresses
  SUPPORT_EMAIL: "support@digitalstore.com",
  SALES_EMAIL: "sales@digitalstore.com",
  INFO_EMAIL: "info@digitalstore.com",
  
  // Social media handles (without URLs)
  SOCIAL_HANDLES: {
    FACEBOOK: "shajghor",
    TWITTER: "shajghor",
    INSTAGRAM: "shajghor",
  },
  
  // Social media URLs
  SOCIAL_URLS: {
    FACEBOOK: "https://facebook.com/shajghor",
    TWITTER: "https://twitter.com/shajghor",
    INSTAGRAM: "https://instagram.com/shajghor",
  },
  
  // Office address
  OFFICE_ADDRESS: {
    STREET: "123 Digital Avenue",
    CITY: "Tech City",
    STATE: "TS",
    ZIP: "10010",
    COUNTRY: "United States",
  },
  
  // Business hours
  BUSINESS_HOURS: {
    WEEKDAYS: "9:00 AM - 6:00 PM EST",
    WEEKENDS: "10:00 AM - 4:00 PM EST",
  },
};

/**
 * Helper functions for contact information
 */

// Generate WhatsApp URL with pre-filled message
export const getWhatsAppUrl = (customMessage = "") => {
  const message = encodeURIComponent(customMessage || ContactInfo.WHATSAPP_MESSAGE);
  return `https://wa.me/${ContactInfo.WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${message}`;
};

// Format phone number for display
export const formatPhoneNumber = () => {
  // Remove + and format as needed
  const cleaned = ContactInfo.WHATSAPP_NUMBER.replace(/\+/g, "");
  // Format: (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return ContactInfo.WHATSAPP_NUMBER;
};

// Get formatted address
export const getFormattedAddress = () => {
  const address = ContactInfo.OFFICE_ADDRESS;
  return `${address.STREET}, ${address.CITY}, ${address.STATE} ${address.ZIP}, ${address.COUNTRY}`;
}; 