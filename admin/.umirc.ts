import { defineConfig } from "@umijs/max";
import defaultSettings from "./config/defaultSetting";
import routes from "./config/routes";

export default defineConfig({
  antd: {},
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
  tailwindcss: {}
});
