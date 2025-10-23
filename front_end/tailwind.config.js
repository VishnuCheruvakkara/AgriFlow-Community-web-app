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
  safelist: [
    // Chat bubble classes
    'chat', 'chat-start', 'chat-end', 'chat-image', 'chat-header', 'chat-bubble', 'chat-footer',
    'chat-bubble-tail', 'chat-bubble-tail-left', 'chat-bubble-tail-right',

    // Tooltip classes
    'tooltip', 'tooltip-open', 'tooltip-bottom', 'tooltip-top', 'tooltip-left', 'tooltip-right',
    'tooltip-content', 'tooltip-primary', 'tooltip-secondary', 'tooltip-accent', 'tooltip-info', 'tooltip-success', 'tooltip-warning', 'tooltip-error'
  ],
}

