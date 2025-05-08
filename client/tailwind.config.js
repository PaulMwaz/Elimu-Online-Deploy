/** @type {import('tailwindcss').Config} */
export default {
  // 🌙 Enable dark mode by toggling the 'dark' class on <html> or <body>
  darkMode: "class",

  // 📂 Specify files Tailwind should scan for class usage
  content: [
    "./index.html", // Root HTML file
    "./src/**/*.{js,html}", // All .js and .html files inside /src directory
  ],

  theme: {
    extend: {
      // 🎨 Custom color palette for the Elimu-Online theme
      colors: {
        primary: "#1F2937", // Used for navbar and sidebar backgrounds
        secondary: "#2563EB", // Used for primary action buttons and highlights
        accent: "#3B82F6", // Used for hover states and call-to-action elements
        light: "#F9FAFB", // Default background for sections
        surface: "#FFFFFF", // Card and container background
        textMain: "#111827", // Primary text color
        darkbg: "#111827", // Deep dark areas (footer/nav) in dark mode
        muted: "#6B7280", // Muted text color for subtext and descriptions
      },
    },
  },

  // 🔌 No custom plugins configured
  plugins: [],
};
