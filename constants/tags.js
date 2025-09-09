// constants/tags.js
// Curated tags for parlours and beauty services

export const PARLOUR_TAGS = [
  // Bridal & events
  "bridal makeup",
  "bridal makeover",
  "mehendi",
  "haldi look",
  "party makeup",
  "event makeup",
  "engagement look",
  "saree draping",

  // Hair services
  "haircut",
  "hair color",
  "highlights",
  "balayage",
  "keratin",
  "protein treatment",
  "hair spa",
  "hair styling",
  "blow dry",

  // Grooming
  "manicure",
  "pedicure",
  "nail art",
  "gel nails",
  "threading",
  "waxing",
  "facial",
  "cleanup",
  "bleach",

  // Men
  "gents haircut",
  "beard styling",
  "shave",

  // Skin & treatment
  "detan",
  "body polishing",
  "microblading",
  "lash lift",
  "eyelash extensions",

  // Packages
  "bridal package",
  "pre-bridal package",
  "groom package",
];

export const PARLOUR_TAG_OPTIONS = PARLOUR_TAGS.map((t) => ({ value: t, label: t.replace(/\b\w/g, (c) => c.toUpperCase()) }));


