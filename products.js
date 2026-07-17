// ─────────────────────────────────────────────────────────────
//  STHIR LIFE — PRODUCTS
//  Add or edit products here. Each product gets its own page at
//  product.html?id=<id>. To add a product photo, drop the image in
//  assets/ and set "image" to e.g. "assets/amla.jpg".
//
//  Fields:
//    id        – unique url-friendly slug
//    name      – product name
//    tagline   – short line under the name
//    image     – optional hero image URL ("" for a soft gradient)
//    price     – optional display price ("" to hide)
//    intro     – 1–2 sentence introduction
//    benefits  – list of { title, text } benefit cards
//    handmade  – paragraphs (array) for the "made by hand" section
//    usage     – optional "how to use" line
// ─────────────────────────────────────────────────────────────
window.STHIR_PRODUCTS = [
  {
    id: "amla-powder",
    name: "Amla Powder",
    tagline: "Sun-dried Indian gooseberry, ground the traditional way.",
    image: "assets/amla-fruit.jpg",
    gallery: ["assets/amla-fruit.jpg", "assets/amla-cross.jpg", "assets/grind.jpg"],
    price: "",
    intro:
      "Amla — the Indian gooseberry — has been trusted in Indian homes for generations. " +
      "Ours is grown on our farm, sun-dried, and stone-ground in small batches so the fruit keeps its natural strength.",
    benefits: [
      { title: "Rich in Vitamin C", text: "One of nature's most concentrated sources of Vitamin C, supporting natural immunity." },
      { title: "Supports Digestion", text: "Traditionally used to aid digestion and support a healthy gut." },
      { title: "Hair & Skin", text: "A time-honoured ingredient for stronger hair and a natural, healthy glow." },
      { title: "Natural Antioxidants", text: "Packed with antioxidants that help the body deal with everyday stress." }
    ],
    handmade: [
      "We don't make Amla powder in a factory. There is no machine line, no additives, and no fillers.",
      "The fruit is harvested by hand from our farm, cleaned, sun-dried, and ground in small batches. Nothing is rushed and nothing is added — just whole amla, turned into powder the way it has been done for generations.",
      "Because it's made by hand in small quantities, every batch is checked by us personally. If we wouldn't feed it to our own family, we won't sell it to yours."
    ],
    usage: "Mix half a teaspoon into water, juice, or your morning routine."
  },
  {
    id: "moringa-powder",
    name: "Moringa Powder",
    tagline: "Hand-picked moringa leaves, shade-dried to keep their green.",
    image: "assets/moringa-powder.jpg",
    gallery: ["assets/moringa-powder.jpg", "assets/moringa-leaves.jpg", "assets/moringa-smoothie.jpg"],
    price: "",
    intro:
      "Moringa is often called the 'miracle tree' for good reason. " +
      "We pick the leaves by hand, shade-dry them gently, and grind them fresh so you get a vivid green powder full of nutrition.",
    benefits: [
      { title: "Nutrient Dense", text: "Naturally rich in vitamins, minerals, and plant protein to support daily energy." },
      { title: "Rich in Iron & Calcium", text: "A plant-based source of iron and calcium for everyday wellbeing." },
      { title: "Antioxidant Support", text: "Loaded with antioxidants that help the body stay balanced and resilient." },
      { title: "Everyday Energy", text: "A gentle, natural lift — no caffeine, no crash." }
    ],
    handmade: [
      "Our Moringa powder is made by hand, not on a factory line. No chemicals, no preservatives, no shortcuts.",
      "The leaves are hand-picked at the right time, shade-dried slowly to protect their colour and goodness, then ground in small batches. That care is exactly why the powder stays such a deep, living green.",
      "Every small batch passes through our own hands before it reaches yours. Honest food, made the way food should be made."
    ],
    usage: "Stir a teaspoon into smoothies, dal, soups, or warm water."
  }
];
