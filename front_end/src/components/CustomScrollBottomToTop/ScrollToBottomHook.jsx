import React, { useState, useEffect, useCallback } from 'react';
import { IoMdArrowDown } from 'react-icons/io';


const ScrollToBottomComponent = ({ 
  containerRef, 
  threshold = 100,
  onNewMessage 
}) => {
  const [showButton, setShowButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Smooth scroll function with easing animation
  const scrollToBottom = useCallback(() => {
    const messagesContainer = containerRef.current;
    if (!messagesContainer) return;

    const startPosition = messagesContainer.scrollTop;
    const targetPosition = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    const distance = targetPosition - startPosition;

    if (distance === 0) return; // Already at bottom

    const duration = Math.min(1000, Math.max(500, Math.abs(distance) / 2));
    const startTime = performance.now();

    // Custom easing function for smoother animation (easeOutCubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Animate scroll
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = easeOutCubic(progress);

      messagesContainer.scrollTop = startPosition + (distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [containerRef]);

  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight <= threshold;
  }, [containerRef, threshold]);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearBottom = isNearBottom();
      setShowButton(!nearBottom);
      
      // Reset unread count when user scrolls to bottom
      if (nearBottom) {
        setUnreadCount(0);
      }
    };

    container.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, threshold, isNearBottom]);

  // Function to increment unread count (can be called from parent)
  const incrementUnreadCount = useCallback(() => {
    if (!isNearBottom()) {
      setUnreadCount(prev => prev + 1);
    }
  }, [isNearBottom]);

  const handleClick = () => {
    scrollToBottom();
    setUnreadCount(0);
  };

  // Return both the button component and utility functions
  return {
    // The button component
    ScrollButton: showButton ? (
      <div className="absolute bottom-20 right-4 z-20">
        <button
          onClick={handleClick}
          className="relative bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 
                     text-gray-600 dark:text-zinc-300 p-3 rounded-full shadow-lg border 
                     border-gray-200 dark:border-zinc-600 transition-all duration-300 
                     transform hover:scale-110 active:scale-95"
          style={{
            animation: 'bounce-gentle 2s infinite'
          }}
        >
          <IoMdArrowDown className="text-xl" />
          
          {/* Unread message count badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs 
                           rounded-full min-w-[20px] h-5 flex items-center justify-center 
                           animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </button>
        
        <style jsx>{`
          @keyframes bounce-gentle {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    ) : null,
    
    // Utility functions
    scrollToBottom,
    isNearBottom,
    incrementUnreadCount,
    showButton
  };
};

export default ScrollToBottomComponent;