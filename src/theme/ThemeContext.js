import React, { createContext, useState, useMemo } from "react";
import { Appearance } from "react-native";
import {
  BASE_COLORS,
  LIGHT_BACKGROUND,
  LIGHT_CARD,
  DARK_BACKGROUND,
  DARK_CARD,
  LIGHT_TEXT,
  LIGHT_TEXT_SECONDARY,
  DARK_TEXT,
  DARK_TEXT_SECONDARY,
} from "../constants/colors";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemScheme || "light");
  const [baseColor, setBaseColor] = useState("blue");

  const themeStyles = useMemo(
    () => ({
      background: theme === "dark" ? DARK_BACKGROUND : LIGHT_BACKGROUND,
      card: theme === "dark" ? DARK_CARD : LIGHT_CARD,
      text: theme === "dark" ? DARK_TEXT : LIGHT_TEXT,
      textSecondary: theme === "dark" ? DARK_TEXT_SECONDARY : LIGHT_TEXT_SECONDARY,
      primary: BASE_COLORS[baseColor], // Accent color (user selectable)
    }),
    [theme, baseColor]
  );

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, baseColor, setBaseColor, themeStyles }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
