import { defineConfig } from "@umijs/max";
import defaultSettings from "./config/defaultSetting";
import routes from "./config/routes";

export default defineConfig({
  antd: {
    theme: {
      token: {
        fontFamily: `"Inter", sans-serif`
      }
    }
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
  tailwindcss: {},
  publicPath: '/admin/',
  headScripts: [
    { src: "/scripts/loading.js", async: true },
  ]
});
