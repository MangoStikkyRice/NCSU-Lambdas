// components/MembersPaymentStatus.jsx
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './MembersPaymentStatus.scss';

const MembersPaymentStatus = () => {
  const [membersData, setMembersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({ billed: 0, paid: 0 });
  const [filters, setFilters] = useState({
    paymentPlan: '',
    paidStatus: '',
    search: '',
  });

// Replace useEffect with mock data
useEffect(() => {
    const data = [
      {
        name: 'Alice Smith',
        email: 'alice@chapter.com',
        paymentPlan: 'Monthly',
        duesBilled: 100,
        paidStatus: true,
      },
      {
        name: 'Bob Johnson',
        email: 'bob@chapter.com',
        paymentPlan: 'Quarterly',
        duesBilled: 250,
        paidStatus: false,
      },
      // Add more mock members
    ];
    setMembersData(data);
    setFilteredData(data);
    calculateTotals(data);
  }, []);
  

  const calculateTotals = (data) => {
    const totalBilled = data.reduce((sum, member) => sum + member.duesBilled, 0);
    const totalPaid = data.reduce((sum, member) => sum + (member.paidStatus ? member.duesBilled : 0), 0);
    setTotals({ billed: totalBilled, paid: totalPaid });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(membersData, newFilters);
  };

  const applyFilters = (data, filters) => {
    let filtered = data;

    if (filters.paymentPlan) {
      filtered = filtered.filter((member) => member.paymentPlan === filters.paymentPlan);
    }

    if (filters.paidStatus) {
      const isPaid = filters.paidStatus === 'Paid';
      filtered = filtered.filter((member) => member.paidStatus === isPaid);
    }

    if (filters.search) {
      const searchText = filters.search.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchText) ||
          member.email.toLowerCase().includes(searchText)
      );
    }

    setFilteredData(filtered);
    calculateTotals(filtered);
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Payment Plan',
      selector: (row) => row.paymentPlan,
      sortable: true,
    },
    {
      name: 'Dues Billed',
      selector: (row) => `$${row.duesBilled.toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Paid Status',
      selector: (row) => (row.paidStatus ? 'Paid' : 'Unpaid'),
      sortable: true,
      cell: (row) => (
        <span className={row.paidStatus ? 'status-paid' : 'status-unpaid'}>
          {row.paidStatus ? 'Paid' : 'Unpaid'}
        </span>
      ),
    },
  ];

  return (
    <div className="members-payment-status">
      <h2>Members Payment Status</h2>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div>Total Dues Billed: <strong>${totals.billed.toFixed(2)}</strong></div>
        <div>Total Dues Paid: <strong>${totals.paid.toFixed(2)}</strong></div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select name="paymentPlan" value={filters.paymentPlan} onChange={handleFilterChange}>
          <option value="">All Payment Plans</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Annually">Annually</option>
        </select>

        <select name="paidStatus" value={filters.paidStatus} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        pointerOnHover
        striped
        responsive
      />
    </div>
  );
};

export default MembersPaymentStatus;
