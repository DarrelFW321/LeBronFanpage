import mdx from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import fs from "fs";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  webpack: (config) => {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap("CopyProjects", () => {
          const src = path.join(process.cwd(), "src/app/[locale]/stats/projects/en");
          const dest = path.join(process.cwd(), "public/projects/en");

          if (fs.existsSync(src)) {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            fs.readdirSync(src).forEach((file) => {
              fs.copyFileSync(path.join(src, file), path.join(dest, file));
            });
          }
        });
      },
    });

    return config;
  },
};

export default withNextIntl(withMDX(nextConfig));
