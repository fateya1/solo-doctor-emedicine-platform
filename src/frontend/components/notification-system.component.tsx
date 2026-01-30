import React from 'react';

const NotificationSystem = ({ notifications }) => {
  return (
    <div>
      <h3>Notifications</h3>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <p>{notification.message}</p>
          <span>{notification.date}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
