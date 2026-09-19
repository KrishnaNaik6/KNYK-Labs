import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KNYK Labs | Digital Studio",
    short_name: "KNYK Labs",
    description:
      "High-impact software development, modern web and mobile applications, AI solutions, automation systems, and digital experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#060911",
    theme_color: "#060911",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
