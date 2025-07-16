import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const EventDetailsHorizontalBar = ({ data }) => {
  // Dark mode detection
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Prepare data combining type and status counts
  const allEventData = [
    {
      label: "Online",
      count:
        data?.event_type?.find((e) => e.event_type === "online")?.count || 0,
    },
    {
      label: "Offline",
      count:
        data?.event_type?.find((e) => e.event_type === "offline")?.count || 0,
    },
    {
      label: "Upcoming",
      count:
        data?.event_status?.find((e) => e.event_status === "upcoming")?.count ||
        0,
    },
    {
      label: "Completed",
      count:
        data?.event_status?.find(
          (e) => e.event_status === "completed"
        )?.count || 0,
    },
    {
      label: "Cancelled",
      count:
        data?.event_status?.find(
          (e) => e.event_status === "cancelled"
        )?.count || 0,
    },
  ];

  const series = [
    {
      name: "Count",
      data: allEventData.map((item) => item.count),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 600,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "60%",
      },
    },
    colors: ["#16a34a"], 
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
    },
    xaxis: {
      categories: allEventData.map((item) => item.label),
      title: {
        text: "Count",
        style: {
          color: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
    },
    yaxis: {
      title: {
        text: "Event Categories",
        style: {
          color: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
      labels: {
        style: {
          colors: isDark ? "#FFFFFF" : "#6B7280",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
    grid: {
      borderColor: isDark ? "#374151" : "#E5E7EB", // Subtle grid color
    },
  };

  return (
    <div className="w-full">
      <ReactApexChart
        key={isDark ? "dark" : "light"} // Force re-render on theme change
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default EventDetailsHorizontalBar;
