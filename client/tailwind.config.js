/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NLAMS Official Brand Browns
        bistre: '#2F1B12',      // Darkest: sidebar background, primary headings
        taupe: '#43392F',       // Secondary dark: top navbar, card headers, default buttons
        kobicha: '#97704F',     // Primary accent: active nav item, links, primary buttons
        chamoisee: '#A08965',   // Mid-tone: borders, dividers, secondary icons
        buff: '#DEAF84',        // Lightest brown: hover backgrounds, highlighted rows, tags

        // Neutrals (80% of pages)
        page: '#FAF7F2',        // Warm off-white background
        surface: '#FFFFFF',     // Solid crisp white card surface
        'text-primary': '#2F1B12',
        'text-muted': '#6B6560',

        // Semantic / Status colors (ONLY for badges & indicators)
        status: {
          success: '#6B7B4C',   // Muted olive green: Acquired, Resolved, Paid
          warning: '#C99A3F',   // Muted amber: Pending, In-progress
          danger: '#A24A3F',    // Muted brick red: Delayed, Disputed, High Risk
          info: '#5B7A8C',      // Muted slate blue: Under review, Neutral
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(47, 27, 18, 0.05), 0 1px 2px -1px rgba(47, 27, 18, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(47, 27, 18, 0.08), 0 2px 4px -2px rgba(47, 27, 18, 0.06)',
      }
    },
  },
  plugins: [],
}
