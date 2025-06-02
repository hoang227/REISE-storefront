# REISE Storefront

A custom Shopify storefront built with Hydrogen, React, and Tailwind CSS for REISE's photobook and print products.

## 🚀 Features

- Custom photobook builder and editor
- Modern, responsive design with Tailwind CSS
- Built on Shopify's Hydrogen framework
- React-based interactive UI components
- Custom font integration

## 🛠️ Tech Stack

- **Framework:** Shopify Hydrogen
- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Router
- **Package Manager:** npm

## 🏗️ Project Structure

```
├── app/
│   ├── components/    # Reusable UI components
│   ├── routes/       # Application routes
│   ├── styles/       # Global styles and Tailwind
│   └── lib/         # Utility functions and helpers
├── public/          # Static assets
└── package.json     # Project dependencies
```

## 🚦 Branch Structure

- `main` - Production-ready code
- `develop` - Active development branch
- `feature/*` - Feature-specific branches

## 🔧 Development

1. Clone the repository
```bash
git clone https://github.com/hoang227/REISE-storefront.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## 📝 Development Workflow

1. Create feature branches from `develop` for significant features
2. Commit changes with descriptive messages
3. Merge completed features back to `develop`
4. Deploy to production by merging `develop` into `main`

## 🌐 Environment Setup

Make sure to set up your `.env` file with necessary Shopify credentials:

```env
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-api-token
```

## 📦 Deployment

The storefront is deployed through Shopify's hosting infrastructure. Deployments are triggered automatically when changes are pushed to the `main` branch.
