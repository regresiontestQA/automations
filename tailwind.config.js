/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[600],
        'primary-foreground': colors.white,
        secondary: colors.gray[200],
        'secondary-foreground': colors.gray[800],
        accent: colors.blue[100],
        'accent-foreground': colors.blue[900],
        background: colors.white,
        foreground: colors.gray[900],
        destructive: colors.red[500],
        'destructive-foreground': colors.white,
        muted: colors.gray[500],
        'muted-foreground': colors.gray[600],
        input: colors.gray[300],
        ring: colors.blue[400],
      },
    },
  },
  plugins: [],
}

