# Sthir Life — Website

A simple, no-build static website that tells the Sthir Life story, showcases products, and sends people to WhatsApp to order. It also has a Stories section you can grow yourself.

_Rooted in Nature. Steady in Life._

## Files

| File          | What it's for                                              |
|---------------|------------------------------------------------------------|
| `index.html`  | Home page (hero, belief, products, featured stories, CTA)  |
| `stories.html`| List of all stories                                        |
| `story.html`  | Reads a single story (`story.html?id=...`)                 |
| `config.js`   | **Your WhatsApp number** and brand settings                |
| `products.js` | **Your products** (Amla & Moringa) — add more here         |
| `product.html`| Reads a single product (`product.html?id=...`)             |
| `stories.js`  | **Your stories** — add new ones here                       |
| `styles.css`  | Look and feel                                              |
| `main.js`     | Logic (WhatsApp links + story rendering)                   |
| `assets/`     | Images (hero background lives here)                         |

## 1. Set your WhatsApp number

Open `config.js` and edit `whatsappNumber` (international format, **digits only** — no `+`, spaces, or dashes):

```js
whatsappNumber: "919876543210",   // e.g. +91 98765 43210
```

Every "Order on WhatsApp" button and the floating green button will open a chat with a pre-filled message (`whatsappGreeting`).

## Contact form

The Contact section on the home page has a form (name, email, subject, message). By default it opens the visitor's email app pre-filled to `email` in `config.js` — so your address is never shown on the page. For messages to arrive directly in your inbox (recommended once live), create a free endpoint at [Formspree](https://formspree.io) or [Getform](https://getform.io) and paste the URL into `formEndpoint` in `config.js`; the form then submits in the background and shows a success message.

## 2. Add or edit a product

Open `products.js`. Each product becomes its own page at `product.html?id=<id>`, listing its benefits and a "made by hand, not in a factory" section. To add another product, copy an existing block, change the `id`, and fill in the `benefits` and `handmade` text. Add a photo by dropping it in `assets/` and setting `image`.

## 3. Publish a new story

Open `stories.js` and add a new block to the **top** of the list (newest first):

```js
{
  id: "harvest-morning",                       // unique, url-friendly
  title: "A Harvest Morning on the Farm",
  date: "August 2026",
  excerpt: "One sentence that appears on the card.",
  image: "assets/harvest.jpg",                 // or "" for no image
  author: "The Sthir Life Family",
  body:
"First paragraph.\n\n" +
"Second paragraph. Leave a blank line (\\n\\n) between paragraphs."
},
```

Save the file — the story appears automatically on the home page and stories page. To add a photo, drop the image in `assets/` and point `image` at it.

## 3. Preview locally

Just double-click `index.html`, **or** run a local server:

```powershell
cd C:\Users\anirudhyadav\sthir-life-website
python -m http.server 8080
# then open http://localhost:8080
```

## 4. Publish online (free options)

- **GitHub Pages** — push this folder to a repo, enable Pages.
- **Netlify / Cloudflare Pages / Vercel** — drag-and-drop the folder.

No build step is needed — it's plain HTML/CSS/JS.
