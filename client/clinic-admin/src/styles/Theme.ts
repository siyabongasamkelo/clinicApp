const breakpoints = {
  mobile: "600px",
  tablet: "900px",
  desktop: "1280px",
};

export const mediaQuries = {
  // ... your existing colors
  breakpoints,
  media: {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (max-width: ${breakpoints.tablet})`,
    desktop: `@media (min-width: ${breakpoints.desktop})`,
  },
};

export const appTheme = {
  colors: {
    primary: "#6B7445",
    secondary: "#4B4B4B",
    tertiary: "#FFFFFF",

    success: "#6CA651",
    error: "#F44336",
  },
  spacing: {
    none: "0",
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "3rem", // 48px
    xxl: "5rem", // 80px
  },
  // Use a scale for consistency
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    xxl: "2rem",
    xxxl: "3rem",
  },

  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.12)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    circle: "50%",
  },

  // Simplified media query helper
  media: {
    mobile: `(max-width: 600px)`,
    tablet: `(max-width: 900px)`,
  },
};
