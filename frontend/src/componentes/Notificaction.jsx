import React from 'react';

const Notification = ({ title, description, color }) => {
  return (
    <div className={`alert ${color} p-3 rounded`}>
      <h4 className="font-bold">{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default Notification;
