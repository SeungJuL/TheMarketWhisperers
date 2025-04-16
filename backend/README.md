# **The Market Whisperers - Setup Guide**

This guide walks you through setting up and running the **Market Whisperers** project on your local machine.

---

## **Prerequisites**
Make sure you have the following installed:
- **Python 3.11+**
- **PostgreSQL 14+**
- **pip** (Python package manager)

---

## **1. Clone the Repository**
```sh
git clone <your-repository-url>
cd TheMarketWhisperers/src
```

---

## **2. Install Dependencies**
```sh
pip install -r requirements.txt
```

---

## **3. Set Up the `.env` File**
Inside the `src` directory, create a file named `.env`:
```sh
touch .env
```
Then, open `.env` and add the following variables:
```
PSQL_DB='your_db_name'
PSQL_HOST='your_db_host_name'
PSQL_USER='your_db_user_name'
PSQL_PWD='your_db_password'
SESSION_SECRET_KEY='your_session_secret_key'
STOCK_API_KEY='your_alphavantage_api_key'
GPT_API_KEY='your_openai_api_key'
```

---

## **4. Run the Application**
```sh
python app.py
```
If everything is set up correctly, you should see output like:
```
 * Running on http://127.0.0.1:8080
```
Open the browser and navigate to `http://127.0.0.1:8080` to access the application.

---

## **5. Stopping the Application**
Press `CTRL + C` in the terminal to stop the Flask server.

---

## **6. Database Schema**
If the database tables are missing, manually create them using the following SQL commands:
```sql
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlists (
    watchlist_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist_items (
    item_id BIGSERIAL PRIMARY KEY,
    watchlist_id BIGINT REFERENCES watchlists(watchlist_id) ON DELETE CASCADE,
    asset_symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(watchlist_id, asset_symbol)
);
```

Run these commands inside `psql` to ensure the tables exist before running the application.

---
