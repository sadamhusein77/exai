# ExpAI - Export Promotion Generator

An AI-powered web application that helps exporters and B2B businesses create high-conversion marketing content for their products using the AIDA (Attention-Interest-Desire-Action) framework.

## Features

- **Product Management (CMS)** - Multi-step wizard for creating structured product data
- **AI Promotion Generation** - Generate professional export marketing content powered by AI
- **16 Languages** - English, Indonesian, Spanish, Arabic, Japanese, French, German, Portuguese, Chinese, Korean, Italian, Russian, Hindi, Thai, Vietnamese, Turkish
- **4 Tones** - Professional, Luxury Export, Marketplace Casual, Technical B2B
- **PDF Export** - Download generated promotions as formatted PDF documents
- **Product Catalog** - View all products with quick promotion generation

## Tech Stack

- **Framework**: React 19.2.4 + TypeScript
- **Build Tool**: Vite 8.0.1
- **Routing**: React Router DOM 7.1.1
- **Styling**: Tailwind CSS 4.3.0 (with dark mode)
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF
- **AI Integration**: OpenRouter API (Llama 3 8B)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Other Commands

```bash
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## Configuration

### API Key Setup

ExpAI uses OpenRouter API for AI content generation. You have two options:

1. **Environment Variable** (recommended for production):
   ```bash
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

2. **In-App Settings**:
   - Click the Settings icon in the header
   - Enter your OpenRouter API key
   - Get your free API key at: https://openrouter.ai/keys

## Project Structure

```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
├── shared/
│   └── globals.css           # Tailwind + custom CSS
├── components/
│   └── ui/                   # Reusable UI primitives
├── domain/                   # Business logic layer
│   ├── entities/            # Product, PromotionContent types
│   ├── repositories/        # Repository interfaces
│   └── usecases/            # Business use cases
├── data/                     # Data access layer
│   ├── datasources/         # localStorage operations
│   └── repositories/         # Repository implementations
└── presentation/            # UI layer
    ├── pages/               # Products, CMS pages
    ├── components/          # Feature components
    └── hooks/               # Custom React hooks
```

## Architecture

Clean architecture with three layers:

- **Domain Layer**: Business entities and use cases (pure TypeScript)
- **Data Layer**: Repository implementations and localStorage persistence
- **Presentation Layer**: React components, pages, and hooks

## Deployment

Configured for Vercel deployment. Output directory: `dist/`

## License

MIT
