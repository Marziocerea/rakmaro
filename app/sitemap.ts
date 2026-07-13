import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = "https://rakmaro.com/";
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
