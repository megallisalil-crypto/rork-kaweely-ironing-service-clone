export const fabricCareOptions = {
  cotton: [
    "Steam ironing",
    "High temperature",
    "Starch application",
    "Fabric softener",
  ],
  silk: [
    "Delicate steam",
    "Low temperature",
    "No starch",
    "Inside-out pressing",
  ],
  wool: [
    "Steam only",
    "Medium temperature",
    "Press cloth required",
    "No direct heat",
  ],
  linen: [
    "High steam",
    "High temperature",
    "Slightly damp ironing",
    "Starch optional",
  ],
  polyester: [
    "Low temperature",
    "Light steam",
    "Quick press",
    "Wrinkle-free finish",
  ],
  delicate: [
    "Cool temperature",
    "Minimal steam",
    "Gentle handling",
    "Protective cover",
  ],
};

export const garmentSpecialCare = {
  Shirt: {
    defaultFabric: "cotton",
    tips: ["Collar stiffening available", "Pocket crease precision", "Button area care"],
  },
  "Dress Shirt": {
    defaultFabric: "cotton",
    tips: ["Professional collar press", "Cuff stiffening", "Crease-free front"],
  },
  Pants: {
    defaultFabric: "cotton",
    tips: ["Sharp crease line", "Waistband pressing", "Pocket smoothing"],
  },
  Dress: {
    defaultFabric: "silk",
    tips: ["Delicate fabric handling", "No shine marks", "Shape preservation"],
  },
  "Suit Jacket": {
    defaultFabric: "wool",
    tips: ["Shoulder shaping", "Lapel pressing", "Lining care"],
  },
  Skirt: {
    defaultFabric: "cotton",
    tips: ["Hem perfection", "Pleat setting", "Zipper area care"],
  },
  Blouse: {
    defaultFabric: "silk",
    tips: ["Delicate button area", "Collar shaping", "Sleeve perfection"],
  },
  Coat: {
    defaultFabric: "wool",
    tips: ["Professional steaming", "Heavy fabric care", "Button protection"],
  },
  Jeans: {
    defaultFabric: "cotton",
    tips: ["Crease removal", "Pocket flattening", "Seam pressing"],
  },
  Bedsheets: {
    defaultFabric: "cotton",
    tips: ["Large surface ironing", "Corner folding", "Fresh pressed finish"],
  },
};

export type FabricType = keyof typeof fabricCareOptions;
export type GarmentType = keyof typeof garmentSpecialCare;
