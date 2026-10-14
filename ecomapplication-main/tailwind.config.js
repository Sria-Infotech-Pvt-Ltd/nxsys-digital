/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3095F8',
        yellowPrimary: '#3095F8',
        yellowHover: '#3095F8',
        greyDark: '#74736f',      // Deep charcoal
        greyLight: '#F5F5F5',    // Silk grey background
        greyMedium: '#E0E0E0',   // Medium grey
        greyBorder: '#EEEEEE',   // Clean border
        textMain: '#1A1A1A',     // Near black text
        textSecondary: '#5F6470',
        lumio: {
          '950': '#000000',
          '900': '#050505',
          'accent': '#3095F8',
        },
      },
      fontFamily: {
        sans: ['Archivo', 'sans-serif'],
      },
      letterSpacing: {
        'lumio-ui': '1px', // Less flashy
      },
      fontSize: {
        'ui-xs': '11px',
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.05)', // B2B cleaner shadows
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        hover: '0 10px 20px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        grid: 'none', // Remove grid background for clean B2B look
      },
      borderRadius: {
        'lumio': '2px', // Sharper corners for B2B feeling
      }
    },
  },
  plugins: [],
};
