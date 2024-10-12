// components/Reimbursements.jsx
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './Reimbursements.scss';

const Reimbursements = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  useEffect(() => {
    // Fetch reimbursements from backend API
    const fetchReimbursements = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch('/api/reimbursements');
        if (!response.ok) {
          throw new Error(`Error fetching reimbursements: ${response.statusText}`);
        }
        const data = await response.json();
        setReimbursements(data);
      } catch (error) {
        console.error('Error fetching reimbursements:', error);
      }
    };

    fetchReimbursements();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const filteredData = reimbursements.filter((item) => {
    const matchesStatus =
      filters.status === '' || item.status.toLowerCase() === filters.status.toLowerCase();
    const matchesSearch =
      filters.search === '' ||
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.reason.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => `$${row.amount.toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Reason',
      selector: (row) => row.reason,
    },
    {
      name: 'Date',
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`status-${row.status.toLowerCase()}`}>{row.status}</span>
      ),
    },
  ];

  return (
    <div className="reimbursements card">
      <h2>Reimbursements</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name or reason"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Denied">Denied</option>
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

export default Reimbursements;
