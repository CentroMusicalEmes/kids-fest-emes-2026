import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/integrations";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 }];
}
