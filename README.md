# The Market Whisperers

A modern full-stack application for market analysis and insights, built with React, Flask, and PostgreSQL.

## 🚀 Features

- Real-time market data analysis using yfinance
- Interactive data visualization
- User authentication and authorization
- Responsive and modern UI with Tailwind CSS
- RESTful API architecture
- AI-powered market insights using OpenAI

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
- Python 3.x
- Flask
- Flask-CORS
- Flask-Login
- PostgreSQL
- yfinance
- OpenAI API
- pytest (testing)
- pylint (code quality)

## 📁 Project Structure

```
TheMarketWhisperers/
├── frontend/              # React frontend application
│   ├── src/              # Source files
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main application component
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
├── backend/             # Flask backend server
│   ├── src/            # Source files
│   │   ├── controllers/ # API controllers
│   │   ├── models/     # Data models
│   │   ├── services/   # Business logic
│   │   ├── tests/      # Test suite
│   │   ├── dtos/       # Data transfer objects
│   │   ├── blueprints/ # Flask blueprints
│   │   └── app.py      # Flask application
│   └── requirements.txt # Python dependencies
└── package.json        # Root project configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.x
- PostgreSQL
- npm or yarn
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TheMarketWhisperers.git
cd TheMarketWhisperers
```

2. Frontend Setup:
```bash
cd frontend
npm install
```

3. Backend Setup:
```bash
cd backend/src
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Environment Setup:
   - Create a `.env` file in the backend/src directory with the following variables:
   ```
   PSQL_DB='your_db_name'
   PSQL_HOST='your_db_host_name'
   PSQL_USER='your_db_user_name'
   PSQL_PWD='your_db_password'
   SESSION_SECRET_KEY='your_session_secret_key'
   STOCK_API_KEY='your_alphavantage_api_key'
   GPT_API_KEY='your_openai_api_key'
   ```

5. Start the development servers:

Frontend (runs on http://localhost:3000):
```bash
cd frontend
npm start
```

Backend (runs on http://localhost:8080):
```bash
cd backend/src
python app.py
```

## 🔧 Development

### Frontend Development
- Uses Vite for fast development and building
- Implements Tailwind CSS for styling
- Uses Chakra UI for component library
- Implements React Router for navigation

### Backend Development
- RESTful API architecture with Flask
- PostgreSQL for data storage (Using AWS RDS)
- Flask-Login for authentication
- yfinance for market data
- OpenAI integration for market insights and chat service
- pytest for testing

## 👥 Authors

Team Members
1. Sam Grosser
2. Ava Sommer
3. Seung Ju Lee
4. James Archibald
5. William Sobczak

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project 
