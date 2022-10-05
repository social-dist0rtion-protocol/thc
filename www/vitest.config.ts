import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "@rollup/plugin-replace";

export default async () => {
  process.env = {
    ...process.env,
    ...{
      VITE_IPFS_GATEWAY: "",
    },
  };
  return defineConfig({
    plugins: [
      svelte({ hot: !process.env.VITEST }),
      replace({
        __VITE_CONTRACTS_ADDRESSES__: JSON.stringify({}),
        __VITE_IPFS_GATEWAY__: "",
      }),
    ],
    ///@ts-ignore
    test: {
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      globals: true,
      environment: "jsdom",
      deps: {
        inline: ["@ethersproject"],
      },
    },
  });
};
