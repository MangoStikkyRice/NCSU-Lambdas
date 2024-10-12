// components/CitationsPage.jsx
import React from 'react';
import './CitationsPage.scss';
import MembersSelection from './MembersSelection';
import DuesGraph from './DuesGraph';
import MembersPaymentStatus from './MembersPaymentStatus';
import Reimbursements from './Reimbursements';

const CitationsPage = () => {
  return (
    <div className="citations-page">
      <h1>Citations Page</h1>
      <div className="grid-container">
        <div className="left-column">
          <MembersSelection />
          <DuesGraph />
        </div>
        <div className="right-column">
          <MembersPaymentStatus />
          <Reimbursements />
        </div>
      </div>
    </div>
  );
};

export default CitationsPage;
