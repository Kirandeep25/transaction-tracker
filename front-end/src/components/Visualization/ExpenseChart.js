import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels'; // Import plugin for better labels

// Register necessary components for Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const generateDynamicColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
};

const ExpenseChart = () => {
    const [chartData, setChartData] = useState({});
    const [options, setOptions] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                const response = await axios.get('http://localhost:8000/api/expenses', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                });
                if (response.status === 200) {
                    const expenses = response.data;

                    const categories = {};
                    expenses.forEach((expense) => {
                        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
                    });

                    const dataValues = Object.values(categories);
                    const labels = Object.keys(categories);
                    const colors = generateDynamicColors(labels.length);

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                data: dataValues,
                                backgroundColor: colors,
                                hoverBackgroundColor: colors.map((color) => color.replace('0.7', '1')), // Brighter on hover
                                hoverOffset: 10, // Creates a popping effect
                            },
                        ],
                    });

                    setOptions({
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        const value = tooltipItem.raw || 0;
                                        return ` ${tooltipItem.label}: $${value}`;
                                    },
                                },
                                bodyFont: {
                                    size: 14, // Increase tooltip text size
                                },
                            },
                            legend: {
                                labels: {
                                    font: {
                                        size: 16, // Increase legend text size
                                    },
                                },
                            },
                            datalabels: {
                                color: '#fff',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                                formatter: (value) => `$${value}`,
                            },
                        },
                        layout: {
                            padding: 20,
                        },
                    });
                }
            } catch (error) {
                console.error('Failed to fetch expenses for chart:', error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div>
    <h2>Category-wise Expense Distribution</h2>
    <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
        {chartData.labels && chartData.labels.length > 0 ? (
            <Pie data={chartData} options={options} />
        ) : (
            <p>No data available to display the chart.</p>
        )}
    </div>
</div>

    );
};

export default ExpenseChart;
