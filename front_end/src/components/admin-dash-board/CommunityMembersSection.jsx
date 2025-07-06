import React, { useState } from "react";
import { MdPeople } from "react-icons/md";
import DefaultUserImage from "../../assets/images/user-default.png";
import { RiSearchLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import Select from "react-select";
import { Link } from "react-router-dom";

export default function MembersSection({ members }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const roleOptions = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
  ];

  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      member.username.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search);

    const matchesRole =
      filterRole === "all"
        ? true
        : filterRole === "admin"
          ? member.is_admin
          : !member.is_admin;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-sm border border-green-400">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-green-400">
        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
          <MdPeople className="text-green-600 dark:text-green-400 w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
          Members
        </h3>
      </div>

      {/* Search Bar and Filter */}
      <div className="px-2 mt-2 flex flex-col md:flex-row md:items-center gap-2">
        <div className="flex items-center flex-1 border border-zinc-300  focus-within:border-green-500 dark:focus-within:border-green-500 dark:border-zinc-600 bg-white dark:bg-zinc-800 rounded-lg shadow-sm px-3 py-1 transition duration-300 ease-in-out">
          <RiSearchLine className="text-gray-500 dark:text-zinc-300 text-xl" />

          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none px-2 py-1 text-gray-700  dark:text-zinc-200 bg-transparent placeholder-gray-500 dark:placeholder-zinc-400"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-500 hover:text-red-500 transition-colors duration-300"
              aria-label="Clear search"
            >
              <ImCancelCircle size={18} />
            </button>
          )}
        </div>

        {/* react-select Dropdown */}
        <div className="w-full md:w-40">
          <Select
            value={roleOptions.find((o) => o.value === filterRole)}
            onChange={(selected) => setFilterRole(selected.value)}
            options={roleOptions}
            isSearchable={false}
            classNamePrefix="react-select"
          />

        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredMembers.map((member) => (
            <Link 
              to={`/admin/users-management/user-details/${member.id}`}
              key={member.id}
              className="border flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-zinc-600 rounded-lg"
            >
              <img
                src={member.profile_image || DefaultUserImage}
                alt={member.username}
                className="w-8 h-8 border rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-gray-800 dark:text-zinc-200">
                  {member.username}
                </h5>
                <p className="text-xs text-gray-500 dark:text-zinc-400 break-words">
                  {member.email}
                </p>
              </div>
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1 py-0.5 rounded">
                {member.is_admin ? "Admin" : "Member"}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="m-2 text-center border-2 border-dashed border-gray-300 text-gray-600 py-8 px-4 bg-gray-100 rounded-md dark:bg-zinc-800 dark:border-zinc-700">
          <p className="text-sm font-semibold dark:text-zinc-300 mb-1">
            No Members Found
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mb-3">
            Try adjusting your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterRole("all");
            }}
            className="mt-2 px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200 text-xs font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
