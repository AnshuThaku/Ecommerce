// themeConfig.js
export const festivalThemes = {
  // ⚡ Updated to Apple Luxury Theme
  default: {
    name: "Default",
    bgLight: "#f5f5f7",      // Apple's signature off-white/light-gray
    bgDark: "#1d1d1f",       // Sleek dark gray (almost black)
    primary: "#c8a253",      // Luxury Gold accent
    textMain: "#1d1d1f",     // Deep gray for reading text (easier on eyes than pure black)
    textLight: "#ffffff",    // Clean white text for dark areas
    heroGradient: "linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%)", // Premium dark metallic gradient
    greeting: "Experience True Luxury. Welcome to our Exclusive Catalogue."
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
  holi: {
    name: "Holi",
    bgLight: "#fff0f5",      // Very soft pink (Lavender blush)
    bgDark: "#4a148c",       // Deep rich purple for contrast
    primary: "#ff4081",      // Vibrant pink/magenta (Gulaal color)
    textMain: "#2a0845",     // Very dark purple for high readability
    textLight: "#ffffff",    // Clean white text for dark areas
    heroGradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 33%, #4facfe 66%, #00f2fe 100%)", // Multi-color splash
    greeting: "🌈 Happy Holi! Add Colors to Your Life with Our Sale 🌈"
  }
};