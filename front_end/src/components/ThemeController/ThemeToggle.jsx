import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
//theme changin sound set up 
import useSound from 'use-sound'
import notificationSound from "../../sounds/mixkit-hard-typewriter-click-1119.wav"


const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isAnimating, setIsAnimating] = useState(false);
  const [playNotification] = useSound(notificationSound,{
    volume:0.5 //50% volume
  })

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    playNotification();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="relative inline-block group tooltip tooltip-bottom" data-tip="Theme">
      <button 
        onClick={toggleTheme}
        className="text-2xl p-1 rounded-full  hover:bg-green-600 transition-colors relative overflow-hidden focus:outline-none " 
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {/* Ripple animation */}
        {isAnimating && (
          <span className="absolute inset-0 pointer-events-none">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full opacity-70 animate-ping" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full opacity-50 animate-pulse" />
          </span>
        )}
        
        {/* Sun/Moon Icon with animation */}
        <div className="relative z-10 flex items-center justify-center h-6 w-6 text-white">
          {theme === 'light' ? (
            <div className={`transform transition-transform duration-500 ${isAnimating ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
          ) : (
            <div className={`transform transition-transform duration-500 ${isAnimating ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          )}
        </div>
      </button>
      
      
    </div>
  );
};

export default ThemeToggle;