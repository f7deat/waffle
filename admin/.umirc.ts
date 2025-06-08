import { defineConfig } from "@umijs/max";
import defaultSettings from "./config/defaultSetting";
import routes from "./config/routes";
const { API_BASE_URL } = process.env;

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
  npmClient: "yarn",
  esbuildMinifyIIFE: true,
  publicPath: "/admin/",
  headScripts: [{ src: "/admin/scripts/loading.js", async: true }],

  define: {
    API_BASE_URL: API_BASE_URL || "https://defzone.net/api/",
  },
  mako: {},
  tailwindcss: {},
});
