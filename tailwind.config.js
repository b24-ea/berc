/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        page: '#FFFFFF',
        card: 'rgba(253, 237, 229, 0.72)',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        accent: '#E8673A',
        'accent-light': 'rgba(253, 237, 229, 0.72)',
        border: '#EEEDE9',
        'card-border': 'rgba(165, 61, 19, 0.38)',
        success: '#4CAF7D',
        error: '#E05252',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'System'],
        medium: ['Inter_500Medium', 'System'],
        semibold: ['Inter_600SemiBold', 'System'],
        bold: ['Inter_700Bold', 'System'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
