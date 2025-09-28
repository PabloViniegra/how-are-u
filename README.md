# How Are U - Facial Beauty Analysis

An AI-powered application for facial beauty analysis through image processing and artificial intelligence.

## Table of Contents

- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Configuration](#api-configuration)
- [Contributing](#contributing)
- [License](#license)

## Technologies

This project is built with modern web technologies:

### Core Stack
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **TailwindCSS v4** - Utility-first CSS framework
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management for Vue.js

### Additional Libraries
- **TanStack Vue Query** - Data fetching and caching
- **GSAP** - High-performance animations
- **Vue Sonner** - Toast notifications
- **Lucide Vue Next** - Beautiful icons

### Development Tools
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **vue-tsc** - TypeScript checker for Vue
- **ESLint** - Code linting

### Fonts
- **Fira Code** (monospace)
- **Inter** (sans-serif)
- **Onest** (sans-serif)

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd how-are-u
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Configure the following variables in `.env`:
- `VITE_API_URL` - Backend API URL
- `VITE_API_KEY` - API authentication key

## Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Development Commands

- `pnpm dev` - Start development server on port 5173
- `pnpm build` - Build for production (runs TypeScript check then Vite build)
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit tests
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Run tests with UI
- `pnpm test:e2e` - Run end-to-end tests

## Building

Build the application for production:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## Testing

### Unit Tests
```bash
pnpm test          # Run tests in watch mode
pnpm test:run      # Run tests once
pnpm test:coverage # Run with coverage
pnpm test:ui       # Run with UI
```

### End-to-End Tests
```bash
pnpm test:e2e
```

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── App.vue                 # Root component
├── style.css              # Global styles
├── router/                # Vue Router configuration
├── stores/                # Pinia stores
│   ├── global-store.ts
│   └── analysis-store.ts
├── pages/                 # Page components
│   ├── HomePage.vue
│   └── BeautyPage.vue
├── components/
│   └── shared/            # Shared components
│       └── Background.vue
├── types/                 # TypeScript type definitions
│   └── index.ts
└── consts/               # Application constants
    └── index.ts
```

## API Configuration

The application connects to a backend API for facial analysis:

- API documentation is available at `http://localhost:8000/docs`
- All requests require an `x-api-key` authorization parameter
- API base URL is configured via `VITE_API_URL` environment variable
- Development server proxies `/api` requests to `http://localhost:8000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use intermediate size components
- Store complex logic in Pinia stores
- Use composables for data fetching with TanStack Query
- Place all TypeScript interfaces in `types/index.ts`
- Place all constants in `consts/index.ts`
- Follow the existing code style and conventions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
