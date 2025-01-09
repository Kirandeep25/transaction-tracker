# Full Stack Expense Tracker

This is a Full Stack Expense Tracker application built using the **MERN stack** (MongoDB, Express, React, and Node.js). The application provides functionality for user authentication (using JWT), expense management, and data visualization with a pie chart for category-wise expense distribution.

---

## Features

### Authentication
- **Sign Up**: Allows users to create an account.
- **Login**: Allows users to log in using their credentials, secured with **JWT (JSON Web Tokens)**.

### Expense Management
- **Add Expense**: Users can add a new expense with details like category, amount, and comments.
- **View Expenses**: Display all expenses in a tabular format, sorted by the latest entry.
- **Edit Expense**: Users can edit existing expenses.
- **Delete Expense**: Users can delete expenses.

### Data Visualization
- **Pie Chart**: Displays category-wise expense distribution using libraries like Chart.js.

---

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **HTML**: Bootstrap framework for responsive design.
- **CSS**: For styling the application. 
- **Axios**: For making API requests to the backend.

### Backend
- **Node.js**: Backend runtime environment.
- **Express.js**: For building the REST API.
- **JWT**: For authentication and secure API access.

### Database
- **MongoDB**: To store user and expense data.

---

## Installation

### Prerequisites
Make sure you have the following installed:
- **Node.js**
- **MongoDB Compass**
- **npm** or **yarn**

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd expense-tracker
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
     JWT_SECRET=your_jwt_secret
     ```

5. Start the application:
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd ../frontend
   npm start
   ```

6. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### Authentication
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/auth/signup`   | Register a new user      |
| POST   | `/auth/login`    | Authenticate and get JWT |

### Expense Management
| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| POST   | `/expenses`      | Add a new expense         |
| GET    | `/expenses`      | Get all expenses          |
| PUT    | `/expenses/:id`  | Update an existing expense|
| DELETE | `/expenses/:id`  | Delete an expense         |

---

## Folder Structure

```
expense-tracker/
├── backend/              # Backend code
│   ├── db/               # database connection
│   ├── controllers/      # API controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── index.js          # Entry point for the backend
│   └── .env              # Environment variables
├── frontend/             # Frontend code
│   ├── public/           # Public assets
│   ├── src/              # React components
│   ├── App.js            # Main React component
│   └── index.js          # Entry point for React
└── README.md             # Documentation
```

---

## License
This project is licensed under the MIT License.
