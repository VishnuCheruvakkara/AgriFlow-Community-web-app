/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        lora: ['Lora', 'serif'],
      },
    },
  },
  plugins: [daisyui],   // ✅ no require()
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  safelist: [
    'chat', 'chat-start', 'chat-end', 'chat-image', 'chat-header', 'chat-bubble', 'chat-footer',
    'chat-bubble-tail', 'chat-bubble-tail-left', 'chat-bubble-tail-right',
    'tooltip', 'tooltip-open', 'tooltip-bottom', 'tooltip-top', 'tooltip-left', 'tooltip-right',
    'tooltip-content', 'tooltip-primary', 'tooltip-secondary', 'tooltip-accent', 'tooltip-info', 'tooltip-success', 'tooltip-warning', 'tooltip-error'
  ],
}
