"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var NotificationSystem = function (_a) {
    var notifications = _a.notifications;
    return (<div>
      <h3>Notifications</h3>
      {notifications.map(function (notification) { return (<div key={notification.id}>
          <p>{notification.message}</p>
          <span>{notification.date}</span>
        </div>); })}
    </div>);
};
exports.default = NotificationSystem;
