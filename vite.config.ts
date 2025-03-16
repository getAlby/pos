import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";

const pwaConfig: Partial<VitePWAOptions> = {
  includeAssets: ["shortcut-icon.png", "icon.png"],
  manifest: {
    name: "BuzzPay PoS",
    short_name: "BuzzPay",
    description: "Alby's super simple self-custodial PoS",
    scope: "/",
    background_color: "#FCE589",
    theme_color: "#FCE589",
    display: "standalone",
    icons: [
      {
        src: "shortcut-icon.png",
        type: "image/png",
        sizes: "256x256", // TODO: replace with 512x512 image
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig)],
  base: "/",
  server: {
    host: "0.0.0.0",
  },
});
