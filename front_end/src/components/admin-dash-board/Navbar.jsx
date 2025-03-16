import React from "react";

const Navbar = () => {
  return (
    <div className="navbar bg-primary text-white">
      <div className="flex-1">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>
      <div className="flex-none">
        <button className="btn btn-outline btn-secondary">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
