# Personalized News Aggregator

A full-stack web application that delivers a personalized news experience, allowing users to browse, filter, search, and save articles based on their interests and Browse history. This project is built with a modern PERN stack, featuring a secure backend API and a responsive, feature-rich React frontend.

**Live Demo URL:** [Link to your deployed project on Vercel]

---

## ✨ Key Features

* **Complete Authentication**: Secure user sign-up, login, and session management using JWT and password hashing.
* **Dynamic Personalized Feed**: The default "For You" feed intelligently suggests articles based on the user's Browse history and bookmarked items.
* **Advanced Filtering & Sorting**:
    * Filter news by keyword search, category, country, and news source.
    * Sort search results by relevance, popularity, or date published.
* **Full Bookmark Functionality**: Users can save their favorite articles, view them on a dedicated page, and remove them.
* **User Preferences**: A settings page where users can save their favorite news categories to customize their feed.
* **Professional & Responsive UI**:
    * A clean, newsroom-inspired theme with Light and Dark modes.
    * Fully responsive layout for all devices, featuring a collapsible desktop sidebar and a mobile drawer.
    * Polished user experience with skeleton loaders, smooth animations, and toast notifications.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React (Vite)
* **Styling**: Tailwind CSS
* **UI Components**: shadcn/ui
* **State Management**: React Context API
* **Routing**: React Router
* **Animations**: Framer Motion
* **API Communication**: Axios
* **Notifications**: Sonner

### **Backend**
* **Framework**: Node.js, Express
* **Database**: PostgreSQL
* **Authentication**: JSON Web Tokens (JWT), bcryptjs
* **Security**: Helmet, express-rate-limit
* **Development**: Nodemon

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### **Prerequisites**

* Node.js (v18 or higher recommended)
* npm or yarn
* PostgreSQL

### **Setup Instructions**

1.  **Clone the Repository**
    ```bash
    git clone [your-github-repository-url]
    cd news-aggregator
    ```

2.  **Backend Setup**
    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Set up the database
    # 1. Ensure PostgreSQL is running.
    # 2. Create a new database (e.g., 'news_aggregator').
    # 3. Connect to your database and run the SQL commands in the database.sql file.

    # Create a .env file in the /server directory
    # and add the required environment variables.
    ```

3.  **Frontend Setup**
    ```bash
    # Navigate to the client directory from the root
    cd client

    # Install dependencies
    npm install
    ```

### **Running the Application**

1.  **Start the Backend Server**
    * In a terminal, from the `/server` directory, run:
        ```bash
        npm start
        ```
    * The server will start on `http://localhost:5000` (or your specified `PORT`).

2.  **Start the Frontend Server**
    * In a *separate* terminal, from the `/client` directory, run:
        ```bash
        npm run dev
        ```
    * Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

---

## 🔑 Environment Variables

Create a `.env` file in the `/server` directory and add the following variables:

| Variable         | Description                                                                                                   | Example                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `PORT`           | The port for the backend server.                                                                              | `5000`                                                               |
| `DATABASE_URL`   | The connection string for your PostgreSQL database.                                                           | 
| `JWT_SECRET`     | A long, random, secret key for signing tokens.                                                                | `a_very_secret_and_long_key_that_is_hard_to_guess`                   |
| `NEWS_API_KEY`   | Your API key from [NewsAPI.org](https://newsapi.org/).                                                         | `your_api_key_from_newsapi`                                          |