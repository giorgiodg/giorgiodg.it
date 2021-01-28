export const sharedPreferences = {
  fonts: {
    primary: "Roboto, Arial, sans-serif",
  },
  breakpoints: {
    xs: "480px",
    sm: "768px",
    md: "992px",
    lg: "1200px",
  },
  borderRadius: "0rem",
  pageWidth: "62.5rem",
  headerHeight: "6.25rem",
  footerHeight: "7.5rem",
}

export const lightTheme = {
  ...sharedPreferences,
  colors: {
    primary: "#DADADA",
    secondary: "#2A2926",
    tertiary: "#E4AA48",
    text: "rgba(255, 255, 255, 0.87)",
    subtext: "#AAAAAA",
    background: "#2e2e35",
    card: "#1C1C1C",
    scrollBar: "rgba(255, 255, 255, 0.5)",
    boxShadow: "rgba(0, 0, 0, 0.16)",
    boxShadowHover: "rgba(0, 0, 0, 0.32)",
  },
}
