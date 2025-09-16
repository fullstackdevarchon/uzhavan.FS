# Uzhavan Labour Frontend

A React-based frontend application for labour management in the Uzhavan platform. This application allows labour workers to manage their assigned orders and track their work progress.

## Features

- **Labour Authentication**: Secure login system for labour workers
- **Dashboard**: Overview of work statistics and recent orders
- **Order Management**: View and update status of assigned orders
- **Real-time Updates**: Live order status tracking and notifications

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Heroicons & Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5174](http://localhost:5174) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/
│   ├── Auth/           # Authentication pages
│   └── Labour/         # Labour-specific pages
├── context/            # React context providers
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## API Endpoints

The application connects to the backend API at `http://localhost:5000/api/labour/`:

- `POST /login` - Labour authentication
- `GET /dashboard` - Dashboard statistics
- `GET /orders` - Fetch assigned orders
- `PUT /orders/:id/status` - Update order status

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request