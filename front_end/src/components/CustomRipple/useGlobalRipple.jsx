import { useEffect } from "react";

const useGlobalRipple = () => {
    useEffect(() => {
        const handleRipple = (e) => {
            const target = e.target.closest(".ripple-parent");
            if (!target) return;

            const ripple = document.createElement("span");
            const diameter = Math.max(target.clientWidth, target.clientHeight);
            const radius = diameter / 2;

            ripple.classList.add("ripple-span");

            // Assign color based on parent class
            if (target.classList.contains("ripple-black")) {
                ripple.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
            } else if (target.classList.contains("ripple-white")) {
                ripple.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
            } else if (target.classList.contains("ripple-green")) {
                ripple.style.backgroundColor = "rgba(34, 197, 94, 0.4)"; // Tailwind green-500
            } else {
                ripple.style.backgroundColor = "rgba(255, 255, 255, 0.4)"; // Default fallback
            }

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
            ripple.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;

            const existingRipple = target.querySelector(".ripple-span");
            if (existingRipple) existingRipple.remove();

            target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        };

        document.addEventListener("click", handleRipple);
        return () => document.removeEventListener("click", handleRipple);
    }, []);
};

export default useGlobalRipple;
