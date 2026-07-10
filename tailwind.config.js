/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          abyss: {
            dark: '#0B0F17',     // The deep slate background from your logo
            card: '#121824',     // Slightly lighter slate for the contrast container
            cyan: '#00F2FE',     // The brilliant electric glowing cyan
            teal: '#00B8C4',     // Deeper accent teal in the shield logo
            text: '#F3F4F6',     // Off-white for perfect dark-mode readability
          }
        },
      },
    },
    plugins: [],
  }