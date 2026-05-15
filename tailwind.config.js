/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#ee5656',
          600: '#e02424',
          700: '#c81e1e',
          800: '#9b1c1c',
          900: '#4c0519', // Dark wine
          950: '#2d0611', // Extra dark wine
        },
        bordeaux: '#881337',
        rose: {
          light: '#fff1f2',
          soft: '#fb7185',
          gold: '#f43f5e',
        },
        premium: {
          white: '#ffffff',
          light: '#fafafa',
          gray: '#f3f4f6',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'scale-up': 'scale-up 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(76, 5, 25, 0.05)',
        'premium-lg': '0 30px 60px rgba(76, 5, 25, 0.08)',
        'wine': '0 10px 30px rgba(76, 5, 25, 0.2)',
      }
    },
  },
  plugins: [],
}
