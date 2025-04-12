# The Market Whisperers

A modern full-stack application for market analysis and insights, built with React, Express, and MongoDB.

## 🚀 Features

- Real-time market data analysis
- Interactive data visualization
- User authentication and authorization
- Responsive and modern UI with Tailwind CSS
- RESTful API architecture

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Chakra UI
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Morgan (logging)

## 📁 Project Structure

```
TheMarketWhisperers/
├── frontend/              # React frontend application
│   ├── src/              # Source files
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # Express backend server
│   ├── src/             # Source files
│   ├── server.js        # Server entry point
│   └── package.json     # Backend dependencies
└── package.json         # Root project configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TheMarketWhisperers.git
cd TheMarketWhisperers
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Environment Setup:
   - Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the development servers:

Frontend (runs on http://localhost:3000):
```bash
cd frontend
npm run dev
```

Backend (runs on http://localhost:5000):
```bash
cd backend
npm run dev
```

## 🔧 Development

### Frontend Development
- Uses Vite for fast development and building
- Implements Tailwind CSS for styling
- Uses Chakra UI for component library
- Implements React Router for navigation

### Backend Development
- RESTful API architecture
- MongoDB for data storage
- Express.js for server framework
- Morgan for request logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project 