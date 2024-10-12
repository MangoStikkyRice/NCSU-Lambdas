import React from 'react';
import './DuesGraph.scss';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DuesGraph = () => {
  const mockDuesData = [
    { date: '2023-01', paidOnTime: 20, latePayments: 5 },
    { date: '2023-02', paidOnTime: 25, latePayments: 3 },
    { date: '2023-03', paidOnTime: 22, latePayments: 6 },
    // Add more data points as needed
  ];

  return (
    <div className="dues-graph card">
      <h2>Dues Payment History</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mockDuesData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="paidOnTime" stroke="#82ca9d" name="Paid On Time" />
          <Line type="monotone" dataKey="latePayments" stroke="#8884d8" name="Late Payments" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DuesGraph;
