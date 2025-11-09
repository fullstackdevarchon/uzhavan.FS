/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-white/30',
    'bg-white/80',
    'backdrop-blur-lg',
    'backdrop-blur-md',
    'from-indigo-600',
    'to-purple-600',
  ]
}
