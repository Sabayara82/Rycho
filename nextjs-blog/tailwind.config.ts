import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          900: '#4E2A00', // Example color
        },
        navy: {
          700: '#000080', // Example color
          800: '#000050', // Darker shade
        },
        purple: {
          400: '#9B72AA', // Example color
          500: '#6E4888', // Example color
          700: '#4B296B', // Darker shade
        },
        green: {
          400: "#006939"
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        'xxl': '1.5rem', // 20px
        'reg': '1rem'
      },
    },
    fontFamily: {
      "bebas-neue-regular": ['Bebas Neue', 'sans-serif']
    },    
  },
  plugins: [],
};
export default config;
