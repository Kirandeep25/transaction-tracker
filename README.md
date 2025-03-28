Transaction Tracker

A full-stack finance tracking application designed to help users manage their expenses, track recurring payments, and visualize financial data. This app supports expense CRUD (Create, Read, Update, Delete), PDF parsing for bank statements, and more.

Features

Expense CRUD: Users can add, update, view, and delete their expenses.
PDF Parsing: The app can extract transaction data from bank statement PDFs for easy input.
Expense Categories: Expenses are organized into customizable categories.
Interactive Dashboard: Visualize your spending with pie charts and expense summaries.
Recurring Expenses: Manage recurring expenses with automatic reminders.
Budget Tracking: Set a budget and track overspending or savings.
Dark Mode: Toggle dark mode for a more comfortable viewing experience.
CSV/PDF Export: Export your expenses and financial reports in CSV or PDF formats.
Responsive Design: Optimized for mobile and desktop devices.

Tech Stack

Frontend: React, Material UI, Chart.js, Tailwind CSS
Backend: Node.js, Express.js, MongoDB
PDF Parsing: pdf-parse for extracting data from PDF files
State Management: React hooks (useState, useEffect)

Installation

Clone the repository

git clone https://github.com/Kirandeep25/transaction-tracker.git
cd transaction-tracker

Install dependencies for both frontend and backend

Navigate to the backend directory:

cd backend

Install the backend dependencies:


npm install

Start the backend server:

npm start

Frontend

Navigate to the frontend directory:

cd client

Install the frontend dependencies:

npm install

Start the frontend server:

npm start

The app should now be accessible at http://localhost:3000.

How to Use

Add an Expense: Fill in the expense details (amount, category, description, date) and click "Add Expense".
Edit an Expense: Click on "Edit" next to any expense to modify its details.
Delete an Expense: Click "Delete" next to any expense to remove it.
Parse PDF Statements: Upload your bank statement PDFs in the app to automatically parse and extract transaction data.
Visualize Data: View your expenses in a pie chart and track your total expenses, savings, and budget.

Future Enhancements

More advanced budget analysis and expense prediction
Support for multiple currencies
Integration with online banking services for direct transaction import
