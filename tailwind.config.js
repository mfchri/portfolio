/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#EDEDEB',
        'page-alt': '#E4E4E2',
        card: '#FFFFFF',
        panel: '#E4E4E2',
        'panel-muted': '#D9D9D7',
        primary: '#1A1A1A',
        secondary: '#6B6B6B',
        border: '#D2D2D0',
        accent: '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'content': '1400px',
      },
      borderRadius: {
        'card-sm': '16px',
        'card': '20px',
        'card-lg': '24px',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
      },
    },
  },
  plugins: [],
}
