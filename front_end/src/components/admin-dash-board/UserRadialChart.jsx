import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import Select from "react-select";

const UserRadialChart = ({ data }) => {
    const [selectedStatus, setSelectedStatus] = useState("profile_completed");

    const statusLabels = {
        profile_completed: "Profile Completed",
        aadhaar_verified: "Aadhaar Verified",
        email_verified: "Email Verified",
        active_users: "Active Users",
    };

    const selectOptions = Object.entries(statusLabels).map(([key, label]) => ({
        value: key,
        label,
    }));

    const totalUsers = data?.total_users || 1; // Avoid division by 0
    const currentValue = data?.[selectedStatus] || 0;
    const percentage = Math.min(100, (currentValue / totalUsers) * 100);

    const options = {
        chart: {
            type: "radialBar",
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "50%",
                },
                track: {
                    background: "#f0f0f0",
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        color: "#6B7280",
                        fontSize: "12px",
                    },
                    value: {
                        color: "#16a34a",
                        fontSize: "20px",
                        show: true,
                        formatter: () => `${Math.round(percentage)}%`,
                    },
                },
            },
        },
        labels: [statusLabels[selectedStatus]],
        colors: ["#16a34a"],
    };

    const series = [percentage];

    return (
        <div className="space-y-4">
            {/* Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select User Status
                </label>
                <Select
                    options={selectOptions}
                    value={selectOptions.find((opt) => opt.value === selectedStatus)}
                    onChange={(selected) => setSelectedStatus(selected.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />
            </div>

            {/* Chart */}
            <div className="flex flex-col items-center justify-center">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="radialBar"
                    height={300}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center ">
                    <span className="font-semibold">{currentValue}</span> of{" "}
                    <span className="font-semibold">{totalUsers}</span> users
                </p>
            </div>
        </div>

    );
};

export default UserRadialChart;
