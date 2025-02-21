/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      colors: {
        accent: "#0989FF",
        topHeadingPrimary: "#010f1c",
        topHeadingSecondary: "#021d35",
        pink: "#FD4B6B",
        blue:'#0f80df'
      },
      container: {
        center: true,
        padding: "15px",
      },

      
    },
  },
  plugins: [],
};
