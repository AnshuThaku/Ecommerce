export const getTheme = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 🎨 HOLI (March)
  if (month === 3 && day >= 5 && day <= 25) {
    return {
      name: "holi",
      bg: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fad0c4)",
      text: "#111",
      accent: "#ff4081"
    };
  }

  // 🪔 DIWALI (Oct-Nov)
  if ((month === 10 && day >= 20) || (month === 11 && day <= 10)) {
    return {
      name: "diwali",
      bg: "#0f0f0f",
      text: "#fff",
      accent: "#f5c518"
    };
  }

  // 🌙 RAMADAN / EID (approx March-April, change every year)
  if ((month === 3 && day >= 10) || (month === 4 && day <= 15)) {
    return {
      name: "eid",
      bg: "#0b3d2e",
      text: "#ffffff",
      accent: "#00c896"
    };
  }

  // 🎄 CHRISTMAS (December)
  if (month === 12 && day >= 20 && day <= 26) {
    return {
      name: "christmas",
      bg: "#8b0000",
      text: "#ffffff",
      accent: "#00ff7f"
    };
  }

  // 🇮🇳 INDEPENDENCE DAY
  if (month === 8 && day === 15) {
    return {
      name: "independence",
      bg: "linear-gradient(orange, white, green)",
      text: "#000",
      accent: "#000080"
    };
  }

  // 🇮🇳 REPUBLIC DAY
  if (month === 1 && day === 26) {
    return {
      name: "republic",
      bg: "linear-gradient(orange, white, green)",
      text: "#000",
      accent: "#000080"
    };
  }

  // 💘 VALENTINE
  if (month === 2 && day === 14) {
    return {
      name: "valentine",
      bg: "#ffdde1",
      text: "#000",
      accent: "#ff4d6d"
    };
  }

  // 🎆 NEW YEAR
  if (month === 1 && day <= 3) {
    return {
      name: "newyear",
      bg: "#000",
      text: "#fff",
      accent: "#ffd700"
    };
  }

  // 🎯 DEFAULT
  return {
    name: "default",
    bg: "#ffffff",
    text: "#111",
    accent: "#d3b574"
  };
};