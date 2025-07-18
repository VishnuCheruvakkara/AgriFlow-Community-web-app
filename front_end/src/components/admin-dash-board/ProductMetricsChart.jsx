import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ProductMetricsChart = ({ data }) => {
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    // Listen for dark mode toggles
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const darkModeOn = document.documentElement.classList.contains("dark");
            setIsDark(darkModeOn);
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

    const categories = [
        "Total Products",
        "Available Products",
        "Wishlist Items",
        "Chat Messages",
        "Units: Piece",
        "Units: Kg",
        "Units: Litre"
    ];

    const seriesData = [
        data?.total_products || 0,
        data?.available_products || 0,
        data?.wishlist_items || 0,
        data?.chat_messages || 0,
        data?.units_piece || 0,
        data?.units_kg || 0,
        data?.units_litre || 0
    ];

    const options = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 600
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "45%",
                borderRadius: 4
            }
        },
        dataLabels: {
            enabled: true
        },
        xaxis: {
            categories,
            labels: {
                show: true,
                rotate: 0,
                trim: true,
                style: {
                    colors: isDark ? "#FFFFFF" : "#6B7280",
                    fontSize: "12px"
                }
            }
        },
        yaxis: {
            title: {
                text: "Count",
                style: {
                    color: isDark ? "#FFFFFF" : "#6B7280"
                }
            },
            labels: {
                style: {
                    colors: isDark ? "#FFFFFF" : "#6B7280"
                }
            }
        },
        colors: ["#16a34a"],
        tooltip: {
            theme: isDark ? "dark" : "light"
        }
    };

    const series = [
        {
            name: "Count",
            data: seriesData
        }
    ];

    return (
        <div className="px-4 pb-4 mt-10">
            <ReactApexChart
                key={isDark ? "dark" : "light"} // IMPORTANT: Force re-render on theme change
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default ProductMetricsChart;
