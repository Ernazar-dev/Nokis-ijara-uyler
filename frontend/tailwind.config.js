/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Seniń reńleriń (brand)
          brand: {
            light: "#1e293b",
            DEFAULT: "#0f172a", // Asosiy Sidebar rangi
            dark: "#020617",
            primary: "#004a99", // Tugmalar
          },
          // Biz aldın isletken 'primary' reńdi de qosıp qoyayıq (kod buzulmaslıǵı ushın)
          primary: "#004a99", 
        }
      },
    },
    plugins: [],
  }