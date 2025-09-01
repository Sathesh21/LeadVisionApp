import React, { createContext, useState, useMemo, useEffect } from "react";
import { Appearance } from "react-native";
import { BASE_COLORS, LIGHT_THEME, DARK_THEME } from "../constants/colors";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(systemScheme || "light");
  const [baseColor, setBaseColor] = useState("blue");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!theme) setTheme(colorScheme || "light");
    });
    return () => subscription?.remove();
  }, []);


  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateBaseColor = (newBaseColor) => {
    setBaseColor(newBaseColor);
  };

  const themeStyles = useMemo(
    () => ({
      ...(theme === "dark" ? DARK_THEME : LIGHT_THEME),
      primary: BASE_COLORS[baseColor],
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    }),
    [theme, baseColor]
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: updateTheme, toggleTheme, baseColor, setBaseColor: updateBaseColor, themeStyles }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
