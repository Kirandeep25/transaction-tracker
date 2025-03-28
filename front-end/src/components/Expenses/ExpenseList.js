import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [filterType, setFilterType] = useState('');
    const [startDate, setStartDate] = useState('');
  
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token'); 
                if (!token) {
                    console.error("No token found.");
                    return;
                }
                const response = await axios.get('http://localhost:8000/api/transactions', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        const total = transactions.reduce((acc, transaction) => {
            return transaction.type === 'Income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        setTotalBalance(total);
    }, [transactions]);

    const handleDelete = async (id) => {
        if (!id) return console.error('No ID provided for deletion');

        try {
            const token = localStorage.getItem('token'); 
            await axios.delete(`http://localhost:8000/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(transactions.filter(transaction => transaction._id !== id));
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    // Filtering logic
    const filteredTransactions = transactions.filter(transaction => {
        const createdAt = new Date(transaction.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!filterType || transaction.type === filterType) &&
               (!filterCategory || transaction.category === filterCategory) &&
               (!start || createdAt >= start) &&
               (!end || createdAt <= end);
    });

    // CSV Export Function
    const exportToCSV = () => {
        const csvContent = "Type,Category,Amount,Comments,Created At,Updated At\n" +
            filteredTransactions.map(trans => 
                `${trans.type},${trans.category},${trans.amount},"${trans.comments || ''}",${new Date(trans.createdAt).toLocaleDateString()},${new Date(trans.updatedAt).toLocaleDateString()}`
            ).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "transactions.csv");
    };

    return (
       <div className="TransactionContainer mt-5">
        <h2 className="mb-4 text-start">Transactions</h2>

        {/* Filters */}
        <div className="d-flex gap-2 mb-3">
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
            </select>
            <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Salary">Salary</option>
                <option value="Freelancing">Freelancing</option>
            </select>
            <button className="btn btn-success" onClick={exportToCSV}>Export CSV</button>
        </div>

        <table className="table table-striped table-hover border shadow">
          <thead className="table-light">
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Comments</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
              .map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.type}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === 'Income' ? 'text-success' : 'text-danger'}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td>{transaction.comments || "N/A"}</td>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(transaction.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="btn btn-danger btn-sm me-2">Delete</button>
                    <button onClick={() => navigate(`/edit-transaction`, { state: { transaction } })} className="btn btn-primary btn-sm">Edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <h4 className="text-start mt-4">
          Total Balance: <span className={totalBalance >= 0 ? "text-success" : "text-danger"}>
            ${totalBalance.toFixed(2)}
          </span>
        </h4>
      </div>
    );
};

export default TransactionList;

