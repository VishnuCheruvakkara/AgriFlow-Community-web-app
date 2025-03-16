import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary">Dashboard Overview</h2>
      <div className="stats shadow mt-4">
        <div className="stat">
          <div className="stat-title">Users</div>
          <div className="stat-value text-primary">1.2K</div>
        </div>
        <div className="stat">
          <div className="stat-title">Orders</div>
          <div className="stat-value text-secondary">350</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
