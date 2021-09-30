import React, { useState } from 'react';

const ThemeContext = React.createContext();

const themes = {
  light: {
    color: "#000000",
    background: "#eeeeee",
    transition: "all 300ms"
  },
  dark: {
    color: "#ffffff",
    background: "#222222",
    transition: "all 300ms"
  }
};

export function ThemeProvider(props) {
    const [ activeTheme, setActiveTheme ] = useState("dark")

    const toggleTheme = () => {
      activeTheme === "dark" ? setActiveTheme("light") : setActiveTheme("dark")
    }

    return (
        <ThemeContext.Provider value={{
          themes,
          activeTheme: activeTheme || "dark",
          setActiveTheme,
          toggleTheme,
        }}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;