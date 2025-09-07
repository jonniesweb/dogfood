# 🐕 Dog Food Calculator

A React-based web application that helps pet owners calculate the appropriate daily food portions for their dogs based on weight and age. The calculator provides recommendations for both raw food and kibble, with options for mixed feeding.

![Dog Food Calculator](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-6.3.5-green) ![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)

## ✨ Features

- **Smart Calculations**: Calculates food portions based on scientific feeding guidelines
- **Dual Food Types**: Supports both raw food and kibble calculations
- **Age-Appropriate**: Adjusts portions based on puppy vs. adult dog requirements
- **Mixed Feeding**: Provides 50/50 raw food and kibble portions for hybrid diets
- **Persistent Storage**: Remembers your dog's information using localStorage
- **Beautiful UI**: Modern design with animated background featuring Poppy faces
- **Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

The app is deployed on Cloudflare Pages. Visit the live version at https://dogfood.jonniesweb.workers.dev.

## 🛠️ Tech Stack

- **Frontend**: React 18 with hooks
- **Styling**: Tailwind CSS with PostCSS
- **Build Tool**: Vite
- **Deployment**: Cloudflare Pages with Wrangler
- **Language**: JavaScript (ES6+)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonniesweb/dogfood.git
   cd dogfood
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the app running.

## 🏗️ Build and Deploy

### Local Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Cloudflare Pages
```bash
npm run deploy
```

This command builds the project and deploys it using Wrangler to Cloudflare Pages.

## 📊 How It Works

### Feeding Guidelines

The calculator uses two different feeding tables:

1. **Raw Food Table**: Based on weight ranges with different portions for puppies vs. adults
2. **Kibble Table**: Uses age-based calculations with weight interpolation

### Age Categories

- **Puppy**: Under 44 weeks (approximately 10 months)
- **Adult**: 44 weeks and older

### Calculations

The app provides:
- Daily total portions for both food types
- Per-serving portions (assuming 3 meals per day)
- Mixed feeding portions (50% raw food + 50% kibble)

## 🎨 UI Features

- **Animated Background**: Floating and rotating Poppy faces create a playful atmosphere
- **Gradient Background**: Soft blue-to-purple gradient
- **Glass Morphism**: Semi-transparent white background with backdrop blur
- **Responsive Design**: Optimized for all screen sizes

## 🔧 Configuration

### Wrangler Configuration
The project includes a `wrangler.jsonc` file for Cloudflare Pages deployment:
- **name**: dogfood
- **compatibility_date**: 2025-09-06
- **assets directory**: ./dist

### Vite Configuration
Uses the Cloudflare plugin for seamless deployment integration.

## 📁 Project Structure

```
dogfood/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React app entry point
│   ├── index.css        # Global styles
│   └── poppy-face.png   # Animated background image
├── dist/                # Build output directory
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── wrangler.jsonc       # Cloudflare deployment config
└── README.md           # This file
```

## 🧮 Feeding Tables

The app uses scientifically-based feeding guidelines:

### Raw Food (grams per day)
Based on weight ranges with separate portions for puppies and adults.

### Kibble (cups converted to grams)
Age-based feeding with weight interpolation:
- 2-4 months
- 4-8 months  
- 8-12 months
- Adult (12+ months)

## 💾 Data Persistence

The app automatically saves and remembers:
- Dog's weight (in pounds)
- Dog's age (in weeks)

Data is stored in the browser's localStorage and persists between sessions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐾 About

Created with ❤️ for dog owners who want to ensure their furry friends get the right nutrition. The calculator helps take the guesswork out of portion control for both raw food and kibble diets.

---

*Happy feeding! 🦴*
