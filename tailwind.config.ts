import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Primary Color Palette based on #155EEF
        primary: {
          25: "#f0f6ff",
          50: "#e6f2ff",
          100: "#cce5ff",
          200: "#99ccff",
          300: "#66b3ff",
          400: "#3399ff",
          500: "#155EEF",
          600: "#0f4bc7",
          700: "#0c3a9f",
          800: "#092977",
          900: "#06184f",
          950: "#030c27",
        },
        // Brand colors for the existing button component
        brand: {
          solid: "#155EEF",
          solid_hover: "#0f4bc7",
          secondary: "#155EEF",
          secondary_hover: "#0f4bc7",
        },
        gray: {
          25: "#fcfcfd",
          50: "#f9fafb",
          100: "#f2f4f7",
          200: "#e4e7ec",
          300: "#d0d5dd",
          400: "#98a2b3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1d2939",
          900: "#101828",
          950: "#0c111d",
        },
        error: {
          25: "#fffbfa",
          50: "#fef3f2",
          100: "#fee4e2",
          200: "#fecdca",
          300: "#fda29b",
          400: "#f97066",
          500: "#f04438",
          600: "#d92d20",
          700: "#b42318",
          800: "#912018",
          900: "#7a271a",
          950: "#55160c",
        },
        warning: {
          25: "#fffcf5",
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fedf89",
          300: "#fec84b",
          400: "#fdb022",
          500: "#f79009",
          600: "#dc6803",
          700: "#b54708",
          800: "#93370d",
          900: "#7a2e0e",
          950: "#4e1d09",
        },
        success: {
          25: "#f6fef9",
          50: "#ecfdf3",
          100: "#dcfae6",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Custom text color
        text: {
          DEFAULT: "#535862",
        },
        // Custom border color for inactive form elements
        border: {
          inactive: "#D5D7DA",
        },
        // Untitled UI design system colors for components
        active: "#f2f4f7",
        secondary: "#344054",
        primary_hover: "#f9fafb",
        primary_alt: "#f2f4f7",
        secondary_alt: "#f9fafb",
        quaternary: "#667085",
        "fg-brand-primary_alt": "#155EEF",
        "brand-secondary": "#155EEF",
        "border-secondary": "#e4e7ec",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        cinzel: ["var(--Font-family-font-family-display)", "Cinzel", "serif"],
        inter: [
          "var(--Font-family-font-family-display, Inter)",
          "Inter",
          "sans-serif",
        ],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      borderRadius: {
        none: "0px",
        xs: "0.125rem",
        sm: "0.25rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        xs: "0px 1px 2px rgba(10, 13, 18, 0.05)",
        sm: "0px 1px 3px rgba(10, 13, 18, 0.1), 0px 1px 2px -1px rgba(10, 13, 18, 0.1)",
        md: "0px 4px 6px -1px rgba(10, 13, 18, 0.1), 0px 2px 4px -2px rgba(10, 13, 18, 0.06)",
        lg: "0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 2px 2px -1px rgba(10, 13, 18, 0.04)",
        xl: "0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03), 0px 3px 3px -1.5px rgba(10, 13, 18, 0.04)",
        "2xl":
          "0px 24px 48px -12px rgba(10, 13, 18, 0.18), 0px 4px 4px -2px rgba(10, 13, 18, 0.04)",
        "3xl":
          "0px 32px 64px -12px rgba(10, 13, 18, 0.14), 0px 5px 5px -2.5px rgba(10, 13, 18, 0.04)",
      },
      // Custom utility classes for Untitled UI components
      outline: {
        "focus-ring": "2px solid transparent",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};

export default config;
