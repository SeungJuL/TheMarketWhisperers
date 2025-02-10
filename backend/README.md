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

## **2. Create and Activate a Virtual Environment** (Recommended)
### **Mac/Linux**
```sh
python3 -m venv venv
source venv/bin/activate
```
### **Windows**
```sh
python -m venv venv
venv\Scripts\activate
```

---

## **3. Install Dependencies**
```sh
pip install -r requirements.txt
```

---

## **4. Set Up the `.env` File**
Inside the `src` directory, create a file named `.env`:
```sh
touch .env
```
Then, open `.env` and add the following variables:
```
PSQL_DB_NAME='see_discord'
PSQL_PWD='see_discord'
SESSION_SECRET_KEY='see_discord'
```

---

## **5. Start PostgreSQL and Create the Database**
### **Start PostgreSQL**
Ensure PostgreSQL is running:
```sh
brew services start postgresql  # macOS (Homebrew)
sudo systemctl start postgresql  # Linux
net start postgresql  # Windows
```

### **Create the Database & User Role**
1. Open PostgreSQL shell:
   ```sh
   psql -U postgres
   ```
2. Inside `psql`, create the database:
   ```sql
   CREATE DATABASE marketwhisperer;
   ```
3. Create the `postgres` user (if not already created):
   ```sql
   CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'your_postgres_password';
   ```
4. Verify the database exists:
   ```sql
   \l
   ```
5. Exit `psql`:
   ```sql
   \q
   ```

---

## **6. Run the Application**
```sh
python3 app.py
```
If everything is set up correctly, you should see output like:
```
 * Running on http://127.0.0.1:8080
```
Open the browser and navigate to `http://127.0.0.1:8080` to access the application.

---

## **7. Troubleshooting**
### **Database Connection Issues**
- Ensure PostgreSQL is running:
  ```sh
  brew services list  # macOS
  sudo systemctl status postgresql  # Linux
  ```
- If you get `"FATAL: role 'postgres' does not exist"`, create the role:
  ```sql
  CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD 'yourpassword';
  ```
- If `"FATAL: database 'marketwhisperer' does not exist"`, create the database:
  ```sql
  CREATE DATABASE marketwhisperer;
  ```

### **Python Dependency Issues**
- Ensure you installed dependencies:
  ```sh
  pip install -r requirements.txt
  ```
- If Flask isn't recognized, activate the virtual environment:
  ```sh
  source venv/bin/activate  # Mac/Linux
  venv\Scripts\activate  # Windows
  ```

---

## **8. Stopping the Application**
Press `CTRL + C` in the terminal to stop the Flask server.

---

## **9. Database Schema**
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
    watchlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist_items (
    item_id SERIAL PRIMARY KEY,
    watchlist_id INT REFERENCES watchlists(watchlist_id) ON DELETE CASCADE,
    asset_symbol VARCHAR(20) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Run these commands inside `psql` to ensure the tables exist before running the application.

---


## **10. Next Steps**
- Ensure your `.env` file is **not committed to Git** (`.gitignore` should include `.env`).
- If deploying to production, use a **proper WSGI server** instead of Flask’s development server.

---