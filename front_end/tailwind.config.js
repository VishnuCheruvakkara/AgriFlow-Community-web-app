/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', //talwind dark modle set up 
  theme: {
    extend: {
      colors: {
        
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // Forces Light Mode
   
  },
}

