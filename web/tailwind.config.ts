import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-primary-container": "#5f0c00",
        "background": "#fcf9f8", "on-secondary": "#ffffff", "on-tertiary-fixed": "#251a00",
        "surface-container-lowest": "#ffffff", "on-primary-fixed-variant": "#881f0a",
        "tertiary-fixed-dim": "#ebc162", "inverse-primary": "#ffb4a4", "outline-variant": "#dfbfb9",
        "tertiary-fixed": "#ffdf9b", "secondary-fixed-dim": "#a7cfbe", "surface-bright": "#fcf9f8",
        "on-surface": "#1b1c1c", "on-secondary-container": "#476c5d", "inverse-surface": "#303030",
        "on-tertiary": "#ffffff", "surface-variant": "#e4e2e1", "error-container": "#ffdad6",
        "secondary-fixed": "#c3ecd9", "on-surface-variant": "#58413d", "error": "#ba1a1a",
        "surface-container-highest": "#e4e2e1", "outline": "#8c716b", "on-secondary-fixed-variant": "#294e40",
        "on-error-container": "#93000a", "surface-tint": "#a9361f", "inverse-on-surface": "#f3f0ef",
        "primary-fixed": "#ffdad3", "surface-dim": "#dcd9d9", "primary": "#a9361f",
        "surface-container-low": "#f6f3f2", "on-primary": "#ffffff",
        "secondary-container": "#c3ecd9", "on-error": "#ffffff", "surface": "#fcf9f8",
        "primary-container": "#f26b4f", "primary-fixed-dim": "#ffb4a4", "on-tertiary-fixed-variant": "#5b4300",
        "surface-container": "#f0eded", "on-background": "#1b1c1c", "on-secondary-fixed": "#002117",
        "tertiary-container": "#b59036", "on-primary-fixed": "#3e0500", "on-tertiary-container": "#3c2b00",
        "secondary": "#416657", "surface-container-high": "#eae7e7", "tertiary": "#785a00"
      }
    },
  },
  plugins: [],
} satisfies Config;
