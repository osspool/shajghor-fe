import  { home, footer } from "./home";
import { product, preview } from "./product";
import { cart, checkout, orders } from "./order";
import { common } from "./common";
import { features, howItWorks, sellHero, fees, sellerFAQ } from "./features";

export const bn = {
  logo: "/brihotbangla_logo.svg",
    home,
    footer,
    product,
    preview,
    common,
    cart,
    checkout,
    profile: {
      tabs: {
        account: "অ্যাকাউন্ট",
        orders: "আমার অর্ডার",
        payments: "পেমেন্ট",
        // Add more as needed
      }
    },
    orders,
    payments: {
      ref: "পেমেন্ট রেফারেন্স",
      methodNA: "উপলব্ধ নয়",
      changeMethod: "পেমেন্ট পদ্ধতি পরিবর্তন করুন",
      payNow: "এখন পেমেন্ট করুন",
      complete: "পেমেন্ট সম্পূর্ণ হয়েছে",
      notPaid: "পেমেন্ট করা হয়নি",
      noPaymentsTitle: "কোনো পেমেন্ট পাওয়া যায়নি",
      noPaymentsMessage: "আপনার কোনো পেমেন্ট রেকর্ড এখনও নেই।"
    },
    errors: {
      loadingOrderDetails: "অর্ডার বিবরণ লোড করতে ব্যর্থ হয়েছে",
      orderNotFound: "অর্ডার পাওয়া যায়নি",
      genericError: "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
      paymentError: "পেমেন্ট প্রক্রিয়াকরণে ত্রুটি"
    },
    features,
    howItWorks,
    sellHero,
    fees,
    sellerFAQ,
    // ... other sections
  }