# Map AI - Location Combo Finder

A modern web application that helps you discover combinations of nearby locations using OpenStreetMap data. Find restaurants near parks, cafes near libraries, shops near transit stations, and more!

## Features

- 🗺️ **Interactive Map** - Explore locations on an interactive Leaflet map with real-time rendering
- 🔍 **Smart Search** - Query for combinations of two different location categories (e.g., restaurants + parks)
- 📍 **Location Tracking** - Automatically get your current location or search from any point on the map
- 🎯 **Adjustable Radius** - Set custom search radius to find nearby locations (up to 10km)
- 📊 **Results Display** - View detailed results in a searchable list with distance calculations
- 🌐 **OpenStreetMap Integration** - Powered by Overpass API for comprehensive location data
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org) - Type-safe development
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Mapping**: [Leaflet](https://leafletjs.com) & [React Leaflet](https://react-leafletjs.org) - Interactive maps
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) - High-quality React components
- **Data Validation**: [Zod](https://zod.dev) - Runtime type validation
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icon set

## Project Structure

```
newapp/
├── app/                 # Next.js App Router
│   ├── api/
│   │   ├── categories/  # API endpoint for location categories
│   │   └── combos/      # API endpoint for location combinations
│   ├── page.tsx         # Main home page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── header.tsx       # Application header
│   ├── map-view.tsx     # Interactive map component
│   ├── search-panel.tsx # Search filters and controls
│   ├── results-list.tsx # Results display
│   └── ui/              # shadcn UI components
├── lib/
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   └── services/
│       ├── overpass.ts  # Overpass API integration
│       └── combo.ts     # Location combo queries
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaheesAhmed/map-ai.git
   cd map-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Load Categories** - Click the search icon to load available location categories
2. **Select Categories** - Choose two different categories from the dropdowns:
   - Category A (primary location type)
   - Category B (secondary location type)
3. **Set Search Radius** - Adjust the slider to set how far to search (in meters)
4. **Choose Location** - Either:
   - Click "Use My Location" to center map on your current position
   - Click on the map to set a custom search center
5. **Search** - Click "Find Combos" to execute the search
6. **View Results** - Browse results in the list or click on the map to see details

## API Endpoints

### GET `/api/categories`
Returns available location categories.
```json
{
  "data": [
    { "id": "restaurant", "name": "Restaurant", "osmTag": "amenity=restaurant" },
    ...
  ]
}
```

### POST `/api/combos`
Search for location combinations.
```json
{
  "lat": 31.5204,
  "lon": 74.3587,
  "radiusMeters": 1000,
  "categoryA": "restaurant",
  "categoryB": "park"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Components

### MapView
Interactive Leaflet map component for displaying locations and search area.

### SearchPanel
Form component for selecting categories, radius, and location with real-time input validation.

### ResultsList
Searchable filtered list of found location combinations with distance information.

### Header
Application header with branding and navigation.

## Development

The application uses:
- **Client-side rendering** for interactive features
- **Server-side API routes** for Overpass API integration
- **Dynamic imports** for map component (SSR disabled for Leaflet)
- **Type safety** with TypeScript throughout

### Environment Variables

No environment variables required for basic functionality. The app uses public APIs.

## Performance Considerations

- **Lazy Loading**: Map component is dynamically imported with SSR disabled
- **Caching**: Results are cached in component state to reduce API calls
- **API Fallback**: Multiple Overpass API endpoints for reliability
- **Optimized Queries**: Efficient OSM tag queries to minimize data transfer

## Browser Support

Works on all modern browsers supporting:
- ES2020+ JavaScript
- Geolocation API
- Fetch API

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue in the repository.
