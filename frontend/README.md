# The Market Whisperers - Frontend

The frontend application for The Market Whisperers, a modern market analysis platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- Interactive stock market dashboard
- Real-time stock chart visualization
- User authentication and profile management
- Responsive design with mobile-first approach
- Modern UI with smooth animations
- Dark/Light mode support

## 🛠️ Tech Stack

- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Chakra UI (Component Library)
- React Router v6 (Navigation)
- Axios (HTTP Client)
- Framer Motion (Animations)
- Heroicons (Icon Library)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx     # Navigation component
│   │   ├── StockChart.jsx # Stock visualization
│   │   ├── StockCard.jsx  # Stock information card
│   │   └── PageWrapper.jsx# Page layout wrapper
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx   # Landing page
│   │   ├── DashboardPage.jsx # Main dashboard
│   │   ├── LoginPage.jsx  # User authentication
│   │   ├── SignupPage.jsx # User registration
│   │   ├── ProfilePage.jsx# User profile
│   │   └── AboutUsPage.jsx# About page
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Component Architecture

1. **Pages**
   - Each page is a self-contained component
   - Uses React Router for navigation
   - Implements responsive design

2. **Components**
   - Reusable UI components
   - Follows atomic design principles
   - Implements Chakra UI components

3. **Styling**
   - Tailwind CSS for utility-first styling
   - Chakra UI for component library
   - Custom CSS for specific needs

### State Management

- React Context for global state
- Local state for component-specific data
- Axios for API communication

### Best Practices

1. **Code Organization**
   - Components are organized by feature
   - Reusable components in shared directory
   - Pages contain page-specific components

2. **Styling**
   - Use Tailwind classes for styling
   - Implement responsive design
   - Follow mobile-first approach

3. **Performance**
   - Code splitting with React.lazy
   - Image optimization
   - Memoization where necessary

## 🎨 UI/UX Guidelines

- Follow Material Design principles
- Implement consistent spacing
- Use the provided color palette
- Ensure accessibility standards
- Support both light and dark modes

## 🔍 Testing

- Component testing with React Testing Library
- End-to-end testing with Cypress
- Performance monitoring

## 📦 Build Process

1. Development
   - Hot module replacement
   - Source maps
   - Fast refresh

2. Production
   - Code minification
   - Asset optimization
   - Tree shaking


