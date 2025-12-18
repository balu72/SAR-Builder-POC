# SAR Builder Frontend

A React + TypeScript frontend application for building Suspicious Activity Reports (SAR) for FIU-IND compliance.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Hook Form** with Zod for form validation
- **TanStack Query** for data fetching
- **pdf-lib** for PDF generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

Build for production:

```bash
npm run build
```

Build for development:

```bash
npm run build:dev
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── data/           # Mock data and constants
├── public/             # Static assets
└── index.html          # HTML entry point
```

## Features

- FIU-IND compliant SAR report generation
- Interactive form with validation
- PDF export using official STR template
- Responsive design
- Dark mode support

## Backend Integration

The frontend expects a Flask backend running at the configured API endpoint. See the backend README for setup instructions.
