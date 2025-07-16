/**
 * Enhanced color palette for MediConnect Health Camp App
 * Modern, attractive colors that complement green while being eye-catching and user-friendly
 */

// Primary green palette - health theme
const primaryGreen = "#2E7D32";
const lightGreen = "#4CAF50";
const emeraldGreen = "#00C853";
const mintGreen = "#E8F5E9";

// Complementary colors - teal and blue
const tealPrimary = "#00695C";
const tealLight = "#26A69A";
const tealAccent = "#B2DFDB";

const bluePrimary = "#26A69A";
const blueLight = "#4DB6AC";
const blueAccent = "#E0F2F1";

// Warm accent colors
const orangeAccent = "#FF7043";
const amberAccent = "#FFC107";
const warmRed = "#E53935";

// Neutral colors
const darkGray = "#263238";
const mediumGray = "#546E7A";
const lightGray = "#ECEFF1";
const softWhite = "#FAFAFA";

export const Colors = {
  light: {
    // Basic theme colors
    text: darkGray,
    background: softWhite,
    tint: tealPrimary,
    icon: mediumGray,
    tabIconDefault: mediumGray,
    tabIconSelected: tealPrimary,

    // Primary colors
    primary: primaryGreen,
    primaryLight: lightGreen,
    primaryDark: "#1B5E20",

    // Secondary colors
    secondary: tealPrimary,
    secondaryLight: tealLight,
    secondaryAccent: tealAccent,

    // Accent colors
    accent: bluePrimary,
    accentLight: blueLight,
    accentSoft: blueAccent,

    // Warm accents
    warning: amberAccent,
    error: warmRed,
    success: emeraldGreen,
    info: blueLight,

    // Card and surface colors
    cardBackground: "#FFFFFF",
    surfaceLight: lightGray,
    surfaceMedium: "#CFD8DC",

    // Text colors
    textPrimary: darkGray,
    textSecondary: mediumGray,
    textLight: "#78909C",
    textOnPrimary: "#FFFFFF",

    // Border and divider colors
    border: "#E0E0E0",
    divider: "#EEEEEE",

    // Gradient colors
    gradientStart: lightGreen,
    gradientEnd: primaryGreen,
    gradientSecondary: [tealLight, tealPrimary],
    gradientAccent: [blueLight, bluePrimary],
  },
  dark: {
    // Basic theme colors
    text: "#ECEDEE",
    background: "#121212",
    tint: tealLight,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tealLight,

    // Primary colors
    primary: lightGreen,
    primaryLight: "#81C784",
    primaryDark: primaryGreen,

    // Secondary colors
    secondary: tealLight,
    secondaryLight: "#4DB6AC",
    secondaryAccent: "#004D40",

    // Accent colors
    accent: blueLight,
    accentLight: "#90CAF9",
    accentSoft: "#1A237E",

    // Warm accents
    warning: "#FFB74D",
    error: "#EF5350",
    success: "#66BB6A",
    info: blueLight,

    // Card and surface colors
    cardBackground: "#1E1E1E",
    surfaceLight: "#2C2C2C",
    surfaceMedium: "#383838",

    // Text colors
    textPrimary: "#FFFFFF",
    textSecondary: "#B0BEC5",
    textLight: "#78909C",
    textOnPrimary: "#000000",

    // Border and divider colors
    border: "#424242",
    divider: "#303030",

    // Gradient colors
    gradientStart: lightGreen,
    gradientEnd: primaryGreen,
    gradientSecondary: [tealLight, tealPrimary],
    gradientAccent: [blueLight, bluePrimary],
  },
};
