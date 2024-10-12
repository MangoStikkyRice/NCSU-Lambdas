// components/MembersSelection.jsx
import React, { useState, useEffect } from 'react';
import './MembersSelection.scss';

const MembersSelection = () => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch members from backend API
    const fetchMembers = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch('/api/members');
        if (!response.ok) {
          throw new Error(`Error fetching members: ${response.statusText}`);
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSelectMember = (email) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email]
    );
  };

  const handleSubmit = () => {
    // Handle the selected members, e.g., send to backend or update state
    console.log('Selected Members:', selectedMembers);
    // Implement your submission logic here
  };

  if (loading) {
    return <div className="members-selection card">Loading members...</div>;
  }

  if (error) {
    return (
      <div className="members-selection card">
        Error loading members: {error.message}
      </div>
    );
  }

  return (
    <div className="members-selection card">
      <h2>Select Members</h2>
      {members.length === 0 ? (
        <div>No members found.</div>
      ) : (
        <ul className="members-list">
          {members.map((member) => (
            <li
              key={member.email}
              className={`member-item ${
                selectedMembers.includes(member.email) ? 'selected' : ''
              }`}
              onClick={() => handleSelectMember(member.email)}
            >
              <div className="member-avatar">
                {/* Use an avatar image if available */}
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-email">{member.email}</span>
              </div>
              <div className="member-checkbox">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.email)}
                  readOnly
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSubmit}>Submit Selection</button>
    </div>
  );
};

export default MembersSelection;
