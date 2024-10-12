// src/components/AddMember.jsx
import React, { useState } from 'react';

function AddMember() {
  // State to hold form data
  const [formData, setFormData] = useState({
    firstName: '',
    lineName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
    paymentPlan: 'Monthly',
    duesBilled: 0.0,
    paidStatus: false,
    lineNumber: 0,
    membershipStatus: '',
    className: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Prepare data to send (ensure data types are correct)
    const dataToSend = {
      ...formData,
      duesBilled: parseFloat(formData.duesBilled),
      lineNumber: parseInt(formData.lineNumber, 10),
      paidStatus: Boolean(formData.paidStatus),
    };
  
    fetch('http://localhost:3000/api/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          let errorMessage = 'Error creating member';
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            console.error('Server Error:', response.status, errorData);
          } else {
            const text = await response.text();
            console.error('Server Error:', response.status, text);
          }
          throw new Error(errorMessage);
        }
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return {};
        }
      })
      .then((data) => {
        console.log('Member created successfully:', data);
        setSuccessMessage('Member added successfully!');
        setErrorMessage('');
        // Optionally reset the form
        setFormData({
          firstName: '',
          lineName: '',
          lastName: '',
          email: '',
          avatarUrl: '',
          paymentPlan: 'Monthly',
          duesBilled: 0.0,
          paidStatus: false,
          lineNumber: 0,
          membershipStatus: '',
          className: '',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage(error.message);
        setSuccessMessage('');
      });
  };
  
  

  // Render the form
  return (
    <div>
      <h1>Add a Member</h1>
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Line Name */}
        <div>
          <label>Line Name:</label>
          <input
            type="text"
            name="lineName"
            value={formData.lineName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Last Name */}
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Avatar URL */}
        <div>
          <label>Avatar URL:</label>
          <input
            type="text"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
          />
        </div>
        {/* Payment Plan */}
        <div>
          <label>Payment Plan:</label>
          <select
            name="paymentPlan"
            value={formData.paymentPlan}
            onChange={handleChange}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
          </select>
        </div>
        {/* Dues Billed */}
        <div>
          <label>Dues Billed:</label>
          <input
            type="number"
            name="duesBilled"
            value={formData.duesBilled}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        {/* Paid Status */}
        <div>
          <label>Paid Status:</label>
          <input
            type="checkbox"
            name="paidStatus"
            checked={formData.paidStatus}
            onChange={handleChange}
          />
        </div>
        {/* Line Number */}
        <div>
          <label>Line Number:</label>
          <input
            type="number"
            name="lineNumber"
            value={formData.lineNumber}
            onChange={handleChange}
          />
        </div>
        {/* Membership Status */}
        <div>
          <label>Membership Status:</label>
          <input
            type="text"
            name="membershipStatus"
            value={formData.membershipStatus}
            onChange={handleChange}
            required
          />
        </div>
        {/* Class Name */}
        <div>
          <label>Class Name:</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
          />
        </div>
        {/* Submit Button */}
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
}

export default AddMember;
