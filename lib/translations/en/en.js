// lib/translations/en/en.js
import { common } from "./common";
import { home, footer } from "./home";
import { cart, checkout, orders } from "./order";
import { product, preview } from "./product";
import { features, howItWorks, sellHero, fees, sellerFAQ } from "./features";

export const en = {
  logo: "/brihoteng_logo.svg",
  home,
  footer,
  product,
  preview,
  common,
  cart,
  checkout,
  profile: {
    tabs: {
      account: "Account",
      orders: "My Orders",
      payments: "Payments",
      // Add more as needed
    },
  },
  orders,
  payments: {
    ref: "Payment Ref",
    methodNA: "N/A",
    changeMethod: "Change Method",
    payNow: "Pay Now",
    complete: "Payment Complete",
    notPaid: "Not Paid",
    noPaymentsTitle: "No payments found",
    noPaymentsMessage: "You don't have any payment records yet.",
  },
  errors: {
    loadingOrderDetails: "Failed to load order details",
    orderNotFound: "Order not found",
    genericError: "Something went wrong. Please try again later.",
    paymentError: "Payment processing error",
  },
  features,
  howItWorks,
  sellHero,
  fees,
  sellerFAQ,
};
