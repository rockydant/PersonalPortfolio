/** Marker stored in `resume_versions.content` to identify CMS rows created by the Bao Dang sample loader. */
export const BAO_DANG_SAMPLE_SEED_MARKER = "bao-dang-v1" as const;

/** Slugs reserved for sample portfolio projects (cleanup targets). */
export const BAO_DANG_SAMPLE_PROJECT_SLUGS = [
  "sample-bao-personal-portfolio",
  "sample-bao-enterprise-commerce-platform",
  "sample-bao-operational-intelligence",
] as const;

/** Slugs reserved for sample blog posts (cleanup targets). */
export const BAO_DANG_SAMPLE_BLOG_SLUGS = ["sample-bao-cto-ai-commerce-outlook"] as const;
