import type { MetadataRoute } from "next";

const baseUrl = "https://academy.solvaone.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/courses", "/learning-paths", "/skills", "/academies", "/instructors", "/schools", "/employers", "/pricing", "/about", "/help", "/privacy", "/terms", "/refund-policy", "/child-safety", "/status"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
