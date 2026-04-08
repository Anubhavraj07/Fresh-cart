const products = [
  // ── Fruits ──────────────────────────────────────────
  {
    id: 1,
    name: "Organic Bananas",
    price: 1.99,
    category: "Fruits",
    emoji: "🍌",
    unit: "bunch",
    inStock: true,
    description: "Sweet and perfectly ripe organic bananas, great for smoothies or snacking."
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    price: 4.49,
    category: "Fruits",
    emoji: "🍓",
    unit: "pack",
    inStock: true,
    description: "Juicy, hand-picked strawberries bursting with flavor."
  },
  {
    id: 3,
    name: "Gala Apples",
    price: 3.29,
    category: "Fruits",
    emoji: "🍎",
    unit: "bag (6ct)",
    inStock: true,
    description: "Crisp and sweet Gala apples, perfect for lunchboxes."
  },
  {
    id: 4,
    name: "Ripe Avocados",
    price: 5.99,
    category: "Fruits",
    emoji: "🥑",
    unit: "bag (4ct)",
    inStock: true,
    description: "Creamy Hass avocados, ready to eat today."
  },

  // ── Vegetables ──────────────────────────────────────
  {
    id: 5,
    name: "Baby Spinach",
    price: 3.49,
    category: "Vegetables",
    emoji: "🥬",
    unit: "5 oz",
    inStock: true,
    description: "Tender baby spinach leaves, pre-washed and ready for salads."
  },
  {
    id: 6,
    name: "Organic Carrots",
    price: 2.79,
    category: "Vegetables",
    emoji: "🥕",
    unit: "1 lb",
    inStock: true,
    description: "Crunchy organic carrots, great raw or roasted."
  },
  {
    id: 7,
    name: "Cherry Tomatoes",
    price: 3.99,
    category: "Vegetables",
    emoji: "🍅",
    unit: "pint",
    inStock: true,
    description: "Sweet cherry tomatoes, perfect for salads and snacking."
  },
  {
    id: 8,
    name: "Bell Peppers",
    price: 4.49,
    category: "Vegetables",
    emoji: "🫑",
    unit: "3 pack",
    inStock: false,
    description: "A colorful trio of red, yellow, and green bell peppers."
  },

  // ── Dairy ───────────────────────────────────────────
  {
    id: 9,
    name: "Whole Milk",
    price: 4.29,
    category: "Dairy",
    emoji: "🥛",
    unit: "gallon",
    inStock: true,
    description: "Farm-fresh whole milk with a rich, creamy taste."
  },
  {
    id: 10,
    name: "Greek Yogurt",
    price: 5.99,
    category: "Dairy",
    emoji: "🫙",
    unit: "32 oz",
    inStock: true,
    description: "Thick, protein-packed plain Greek yogurt."
  },
  {
    id: 11,
    name: "Cheddar Cheese",
    price: 6.49,
    category: "Dairy",
    emoji: "🧀",
    unit: "block",
    inStock: true,
    description: "Sharp aged cheddar cheese, ideal for sandwiches and cooking."
  },
  {
    id: 12,
    name: "Free-Range Eggs",
    price: 5.79,
    category: "Dairy",
    emoji: "🥚",
    unit: "dozen",
    inStock: true,
    description: "Farm-fresh free-range eggs with bright orange yolks."
  },

  // ── Bakery ──────────────────────────────────────────
  {
    id: 13,
    name: "Sourdough Bread",
    price: 4.99,
    category: "Bakery",
    emoji: "🍞",
    unit: "loaf",
    inStock: true,
    description: "Artisan sourdough with a crispy crust and tangy flavor."
  },
  {
    id: 14,
    name: "Croissants",
    price: 5.49,
    category: "Bakery",
    emoji: "🥐",
    unit: "4 pack",
    inStock: true,
    description: "Buttery, flaky French croissants baked fresh daily."
  },
  {
    id: 15,
    name: "Blueberry Muffins",
    price: 4.79,
    category: "Bakery",
    emoji: "🧁",
    unit: "4 pack",
    inStock: true,
    description: "Moist muffins loaded with fresh blueberries."
  },
  {
    id: 16,
    name: "Bagels",
    price: 3.99,
    category: "Bakery",
    emoji: "🥯",
    unit: "6 pack",
    inStock: true,
    description: "Classic New York-style bagels, perfect toasted with cream cheese."
  },

  // ── Beverages ───────────────────────────────────────
  {
    id: 17,
    name: "Orange Juice",
    price: 5.49,
    category: "Beverages",
    emoji: "🧃",
    unit: "52 fl oz",
    inStock: true,
    description: "100% freshly squeezed orange juice, no pulp."
  },
  {
    id: 18,
    name: "Sparkling Water",
    price: 4.99,
    category: "Beverages",
    emoji: "💧",
    unit: "12 pack",
    inStock: true,
    description: "Crisp, refreshing sparkling water with natural minerals."
  },
  {
    id: 19,
    name: "Cold Brew Coffee",
    price: 6.99,
    category: "Beverages",
    emoji: "☕",
    unit: "32 fl oz",
    inStock: true,
    description: "Smooth, low-acid cold brew concentrate. Dilute to taste."
  },
  {
    id: 20,
    name: "Green Tea",
    price: 3.79,
    category: "Beverages",
    emoji: "🍵",
    unit: "20 bags",
    inStock: true,
    description: "Premium Japanese green tea bags for a calm, focused energy."
  },

  // ── Snacks ──────────────────────────────────────────
  {
    id: 21,
    name: "Mixed Nuts",
    price: 8.99,
    category: "Snacks",
    emoji: "🥜",
    unit: "16 oz",
    inStock: true,
    description: "Roasted and salted mixed nuts — almonds, cashews, pecans, walnuts."
  },
  {
    id: 22,
    name: "Dark Chocolate Bar",
    price: 3.49,
    category: "Snacks",
    emoji: "🍫",
    unit: "3.5 oz",
    inStock: true,
    description: "72% cacao dark chocolate, rich and smooth."
  },
  {
    id: 23,
    name: "Tortilla Chips",
    price: 4.29,
    category: "Snacks",
    emoji: "🌮",
    unit: "13 oz",
    inStock: true,
    description: "Restaurant-style tortilla chips made with stone-ground corn."
  },
  {
    id: 24,
    name: "Granola Bars",
    price: 4.99,
    category: "Snacks",
    emoji: "🍯",
    unit: "6 pack",
    inStock: true,
    description: "Crunchy oat & honey granola bars, perfect on-the-go snack."
  }
];

module.exports = products;
