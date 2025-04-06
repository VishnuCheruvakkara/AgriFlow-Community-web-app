import { useEffect, useState } from "react";
import { FiArrowUpCircle } from "react-icons/fi";

const CustomScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200);
    };

    // Check if user has reached the top
    const checkScrolling = () => {
      if (window.scrollY === 0) {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("scroll", checkScrolling);
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("scroll", checkScrolling);
    };
  }, []);

  const scrollToTop = () => {
    setIsScrolling(true);
    
    // Calculate the duration based on how far down the page we are
    const duration = Math.min(1500, Math.max(800, window.scrollY / 2));
    const startPosition = window.scrollY;
    const startTime = performance.now();
    
    // Custom easing function for smoother animation (easeOutCubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    // Animate scroll
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  return (
    <div 
      className={`fixed bottom-14 right-5 z-50 transition-all duration-700 ease-in-out ${
        visible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`hidden lg:flex bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 ${
          isScrolling ? "animate-pulse" : ""
        }`}
      >
        <FiArrowUpCircle 
          size={31} 
          className="transition-opacity duration-300 ease-in-out"
        />
      </button>
    </div>
  );
};

export default CustomScrollToTop;