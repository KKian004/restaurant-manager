# Restaurant Manager

A modern, beautiful restaurant management application optimized for iPad with PWA capabilities.

## Features

- **Customizable Menu**: Add, edit, and delete menu items with categories (Main, Appetizer, Dessert, Beverage) and emoji icons
- **Order Taking**: Easy-to-use touch-friendly interface for taking orders with quantity management
- **Receipt Generation**: Generate and print professional receipts for completed orders
- **Order History**: Track all past orders with details and reprint receipts
- **Data Persistence**: All data is automatically saved to localStorage
- **PWA Support**: Install as an app on iPad for a native-like experience
- **Smooth Animations**: Beautiful transitions and animations for a premium feel
- **Touch Optimized**: Large touch targets and gestures optimized for iPad

## Deployment Without CMD (Command Line)

### Option 1: Netlify Drop (Easiest - No CMD Required)

1. **Build the app first** (one-time CMD use required):
   - Open Command Prompt
   - Navigate to: `cd C:\Users\Arthur\CascadeProjects\restaurant-manager`
   - Run: `npm install` (if not done before)
   - Run: `npm run build`
   - This creates a `dist` folder with the built app

2. **Deploy to Netlify**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder (created in step 1) onto the page
   - Netlify will automatically deploy your app
   - You'll get a URL like `https://your-app-name.netlify.app`

### Option 2: Vercel (Web Interface)

1. **Build the app** (same as above - one-time CMD use)
2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New" → "Project"
   - Import your project folder
   - Vercel will detect it's a Vite project and deploy automatically
   - You'll get a URL like `https://your-app.vercel.app`

### Option 3: GitHub Pages (Web Interface)

1. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Upload your project files via the web interface

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as source
   - Add a workflow file (Vercel/Netlify is easier if you want to avoid this)

### Option 4: Cloudflare Pages (Web Interface)

1. **Build the app** (same as above)
2. **Deploy to Cloudflare**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Go to Workers & Pages → Create → Pages
   - Upload the `dist` folder
   - You'll get a URL like `https://your-app.pages.dev`

## iPad Setup (After Deployment)

### Step 1: Access on iPad
1. Open Safari on your iPad
2. Navigate to your deployed URL (from Netlify, Vercel, etc.)
3. The app will load in Safari

### Step 2: Install as App (PWA)
1. Tap the Share button (square with arrow at bottom)
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" in the top right
4. The app icon will appear on your iPad home screen
5. Tap it to launch like a native app

### Step 3: Full Screen Experience
- The app will launch in full screen (no Safari browser bar)
- It works offline (after first load)
- Data persists in localStorage

## Local Development (Optional)

If you want to test locally before deploying:

1. Navigate to project folder in Command Prompt:
```bash
cd C:\Users\Arthur\CascadeProjects\restaurant-manager
```

2. Install dependencies (one-time):
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser to the URL shown (usually http://localhost:5173)

## Usage

### Taking Orders
1. Tap menu items to add them to the current order
2. Adjust quantities using the large +/- buttons (touch-friendly)
3. Remove items using the trash icon
4. Tap "Complete Order" to finalize and save the order

### Managing Menu
1. Navigate to the "Menu" tab
2. Tap "Add Item" to create new menu items
3. Add emoji icons for visual appeal
4. Use the edit icon to modify existing items
5. Use the trash icon to delete items

### Viewing History & Receipts
1. Navigate to the "Order History" tab
2. View all past orders with details
3. Tap "Receipt" to generate and print a receipt for any order

## Design Features

- **Glassmorphism UI**: Modern glass-like effects with blur and transparency
- **Gradient Backgrounds**: Beautiful blue/cyan gradient theme
- **Smooth Animations**: Fade-in, slide-up, and scale animations
- **Touch-Friendly**: 48px minimum touch targets for easy iPad use
- **Responsive**: Adapts to different screen sizes
- **Dark Theme**: Easy on the eyes with high contrast

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS
- Lucide React (icons)
- PWA (Progressive Web App)
- localStorage for data persistence

## Troubleshooting

**App not loading on iPad?**
- Ensure you're using HTTPS (required for PWA)
- Check that the service worker is registered (open Safari Dev Tools)
- Try clearing Safari cache and reloading

**Data not saving?**
- localStorage is device-specific
- Data won't sync between devices
- Each iPad maintains its own data
