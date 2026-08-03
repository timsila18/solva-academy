import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/learning-paths", "/skills", "/academies", "/instructors", "/schools", "/pricing", "/about", "/help", "/privacy", "/terms", "/refund-policy", "/child-safety", "/status"],
        disallow: ["/admin", "/academy", "/organization", "/learner", "/instructor", "/checkout", "/settings", "/ai", "/api"],
      },
    ],
    sitemap: "https://academy.solvaone.co.ke/sitemap.xml",
  };
}
