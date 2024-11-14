// ProgramsList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProgramsList = () => {
  return (
    <div>
      <h1>Our Programs</h1>
      <ul>
        <li><Link to="/programs/dating">Dating & Relationships</Link></li>
        <li><Link to="/programs/grief">Grief & Loss Counseling</Link></li>
        <li><Link to="/programs/self">Self-Esteem Therapy</Link></li>
        <li><Link to="/programs/kids">Kids & Family</Link></li>
        <li><Link to="/programs/future">Life & Future Planning</Link></li>
        <li><Link to="/programs/old">Old Age Therapy</Link></li>
      </ul>
    </div>
  );
};

export default ProgramsList;
