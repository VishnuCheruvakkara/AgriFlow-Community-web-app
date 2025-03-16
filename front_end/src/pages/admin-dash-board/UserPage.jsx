import React from "react";


const UsersPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary">User Management</h2>
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Admin</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>User</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
