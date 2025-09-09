"use client";
import { useEffect } from "react";

const stepsData = [
  {
    id: 1,
    title: "Browse Caterers",
    description: "Explore profiles and menus of local home caterers, filtering by cuisine, availability, and more.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
    imageAlt: "Browse caterers"
  },
  {
    id: 2,
    title: "Choose Date & Dishes",
    description: "Select your preferred delivery date and add available dishes to your cart with any customizations.",
    image: "https://images.unsplash.com/photo-1611599538835-b52a8c2af7fe?q=80&w=1974&auto=format&fit=crop",
    imageAlt: "Choose date and dishes"
  },
  {
    id: 3,
    title: "Enjoy Your Meal",
    description: "Receive your freshly prepared food via delivery or pickup on your selected date and time.",
    image: "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=1828&auto=format&fit=crop",
    imageAlt: "Enjoy your meal"
  }
];

const HowItWorks = () => {
  // Animation for sections becoming visible
 

  return (
    <section className="p-8">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium mb-2">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Enjoy Homemade Food in 3 Easy Steps
          </h2>
          <p className="text-platform-600">
            HalaEats connects you with talented home caterers in your area,
            offering unique and authentic dishes for delivery or pickup on your
            chosen date.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepsData.map((step) => (
            <div key={step.id} className="relative bg-platform-50  rounded-xl p-6 shadow-elevation-soft hover-lift text-center">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background font-bold">
                {step.id}
              </div>
              <div className="mt-6 mb-4">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  className="h-40 w-40 object-cover rounded-full mx-auto shadow-md"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-platform-600 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
