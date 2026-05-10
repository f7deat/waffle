import { defineConfig } from "@umijs/max";
import defaultSettings from "./config/defaultSetting";
import routes from "./config/routes";

export default defineConfig({
  antd: {
    theme: {
      token: {
        fontFamily: `"Inter", sans-serif`,
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    ...defaultSettings,
  },
  locale: {
    default: "vi-VN",
    baseSeparator: "-",
    antd: true,
  },
  history: {
    type: "hash",
  },
  routes,
  npmClient: "npm",
  esbuildMinifyIIFE: true,
  headScripts: [{ src: "/scripts/loading.js", async: true }],
  define: {
    "process.env": {
      API_URL: process.env.API_URL,
      COMPANY_NAME: process.env.COMPANY_NAME
    },
  },
  mako: {},
  tailwindcss: {},
});
