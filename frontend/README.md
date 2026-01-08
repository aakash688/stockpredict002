# Stock Analysis & Prediction Platform - Frontend

React + Vite frontend for the Stock Analysis & Prediction Platform.

## Features

- Modern, responsive UI with dark mode
- Real-time stock search and display
- Interactive charts with multiple time periods
- AI-powered price predictions
- Watchlist management
- Portfolio tracking with P/L calculations
- Admin panel
- User authentication

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:8000
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **React Query** - Data fetching
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Recharts** - Charting
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── store/         # Zustand stores
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── lib/           # Library utilities
```

## Environment Variables

- `VITE_API_URL` - Backend API URL

## License

MIT

