// themeConfig.js
export const festivalThemes = {
  default: {
    name: "Default",
    bgLight: "#f4f7f6",      // Light greyish background
    bgDark: "#2c3e50",       // Dark blue footer/navbar
    primary: "#3498db",      // Standard blue button/accent
    textMain: "#333333",
    textLight: "#ffffff",
    heroGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    greeting: "Welcome to Our Platform"
  },
  diwali: {
    name: "Diwali",
    bgLight: "#fff8e1",      // Warm light yellow
    bgDark: "#5c1a06",       // Deep maroon/brown
    primary: "#ff8c00",      // Festive orange
    textMain: "#4a1504",
    textLight: "#ffdf00",    // Gold text for dark bg
    heroGradient: "linear-gradient(135deg, #ff9900 0%, #e63946 100%)",
    greeting: "✨ Happy Diwali! Special Festive Offers Inside ✨"
  },
  eid: {
    name: "Eid",
    bgLight: "#f0fff4",      // Light mint green
    bgDark: "#004d40",       // Deep emerald green
    primary: "#00bfa5",      // Teal/bright green
    textMain: "#00332a",
    textLight: "#ffd54f",    // Soft gold text for dark bg
    heroGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    greeting: "🌙 Eid Mubarak! Celebrate with Our Exclusive Deals 🌙"
  },
  // 👇 Holi Theme added here
  holi: {
    name: "Holi",
    bgLight: "#fff0f5",      // Very soft pink (Lavender blush)
    bgDark: "#4a148c",       // Deep rich purple for contrast
    primary: "#ff4081",      // Vibrant pink/magenta (Gulaal color)
    textMain: "#2a0845",     // Very dark purple for high readability
    textLight: "#ffffff",    // Clean white text for dark areas
    heroGradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 33%, #4facfe 66%, #00f2fe 100%)", // Multi-color splash (Red -> Orange -> Blue -> Cyan)
    greeting: "🌈 Happy Holi! Add Colors to Your Life with Our Sale 🌈"
  }
};