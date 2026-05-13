/**
 * Structured profile content derived from `bao-dang.md` in the repo (executive / CTO narrative).
 * Printable resume PDF is a separate artifact; this seed populates the CMS only.
 */

import {
  BAO_DANG_SAMPLE_BLOG_SLUGS,
  BAO_DANG_SAMPLE_PROJECT_SLUGS,
} from "@/lib/sample-data/bao-dang-constants";

export type SampleProjectSeed = {
  slug: (typeof BAO_DANG_SAMPLE_PROJECT_SLUGS)[number];
  title: string;
  summary: string;
  body: string;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type SampleBlogSeed = {
  slug: (typeof BAO_DANG_SAMPLE_BLOG_SLUGS)[number];
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
};

export type SampleExperienceSeed = {
  company: string;
  role_title: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  sort_order: number;
};

export type SampleSkillSeed = {
  category: string | null;
  name: string;
  proficiency: string | null;
  sort_order: number;
};

export const baoDangResumeHeadline =
  "Chief Technology Officer · Enterprise Architect · AI & Data Platform Strategist";

export const baoDangResumeSummary = `Technology executive, software architect, and AI-driven systems leader with 17+ years of experience building scalable enterprise platforms, e-commerce ecosystems, cloud infrastructure, distributed systems, and operational intelligence.

Led technology transformation for high-growth companies across e-commerce, fulfillment, marketplaces, AI systems, and enterprise operations—combining deep technical architecture with executive leadership, business strategy, data science, and operational scaling.`;

export const baoDangSampleProjects: SampleProjectSeed[] = [
  {
    slug: BAO_DANG_SAMPLE_PROJECT_SLUGS[0],
    title: "Personal portfolio & resume OS",
    summary:
      "Next.js + Supabase portfolio and resume CMS—public site, admin, auth, and operational analytics aligned with executive positioning.",
    body: `Shipped a full-stack personal branding platform: App Router, Tailwind v4, Supabase Auth with magic link and OAuth, RLS-scoped content, and Vercel analytics.

Demonstrates how CTO-level operators can own narrative, resume versions, projects, blog, and inbound inquiries without surrendering data to a closed SaaS profile.`,
    github_url: null,
    featured: true,
    sort_order: 0,
    published: true,
  },
  {
    slug: BAO_DANG_SAMPLE_PROJECT_SLUGS[1],
    title: "Global commerce & marketplace convergence",
    summary:
      "Technology leadership across DTC, Amazon, Walmart, TikTok Shop, and international marketplaces for a $100M+ apparel brand.",
    body: `As CTO at Ethika Inc. (2024–present), led cloud modernization, AI-enabled internal systems, unified BI pipelines, and marketplace integrations into centralized operations.

Outcomes referenced in profile materials: eliminated ~$150K/year recurring platform cost, Shopify migration with early six-figure revenue impact, 24/7 global engineering coverage, and executive dashboards for operational visibility.`,
    github_url: null,
    featured: true,
    sort_order: 1,
    published: true,
  },
  {
    slug: BAO_DANG_SAMPLE_PROJECT_SLUGS[2],
    title: "Fulfillment scale & distributed systems",
    summary:
      "Order-capacity growth from 20K to 100K+ daily orders with peaks beyond 400K at a logistics and fulfillment organization.",
    body: `As Team Leader at The Dot Corp (2022–2024), focused on distributed systems, Azure infrastructure, partner API integrations, and automation of manual operational workflows.

Earlier roles include ERP modernization and print-on-demand scale (Gearment), and large-scale commerce/finance modernization (Aswhite Global) with measurable client savings.`,
    github_url: null,
    featured: false,
    sort_order: 2,
    published: true,
  },
];

export const baoDangSampleBlogPosts: SampleBlogSeed[] = [
  {
    slug: BAO_DANG_SAMPLE_BLOG_SLUGS[0],
    title: "Why CTOs should own the portfolio stack—not only the product stack",
    excerpt:
      "Executive visibility, narrative control, and AI-era positioning when your public footprint is part of the operating system.",
    body: `Board-facing technology leaders are evaluated on outcomes and narrative, not only JIRA throughput. A portfolio you control—resume versions, published projects, and selective thought leadership—becomes part of the same reliability model you bring to production systems.

This sample post ships with the portfolio CMS to illustrate how markdown-friendly blog content, structured projects, and a published resume bundle reinforce a coherent story: enterprise architecture, AI-driven operations, commerce infrastructure, and operational intelligence.

Profile source: structured from the repository markdown profile; extend or replace with your own posts before going live.`,
    published: true,
  },
];

export const baoDangSampleExperience: SampleExperienceSeed[] = [
  {
    company: "Ethika Inc.",
    role_title: "Chief Technology Officer",
    location: null,
    start_date: "2024-01-01",
    end_date: null,
    description: `Global technology transformation for a $100M+ apparel and lifestyle brand across DTC, Amazon, Walmart, TikTok Shop, and international marketplaces.

• Eliminated ~$150K/year in recurring platform and infrastructure costs
• Delivered Shopify migration generating early six-figure revenue
• Built AI-enabled internal operational systems; unified BI and reporting pipelines
• Integrated marketplace ecosystems into centralized operations; scaled 24/7 engineering coverage`,
    sort_order: 0,
  },
  {
    company: "The Dot Corp",
    role_title: "Team Leader",
    location: null,
    start_date: "2022-01-01",
    end_date: "2024-01-01",
    description: `Distributed systems and enterprise integrations for fulfillment and logistics.

• Increased daily order capacity from 20,000 to 100,000+; peak scaling beyond 400,000 daily orders
• Automated manual operational workflows; integrated partner APIs and enterprise systems
• Managed Azure cloud infrastructure; improved fulfillment reliability and scalability`,
    sort_order: 1,
  },
  {
    company: "Gearment LLC",
    role_title: "Project Manager / Technical Leader",
    location: null,
    start_date: "2021-01-01",
    end_date: "2022-01-01",
    description: `ERP modernization and operational scaling for a global print-on-demand company.

• Implemented Odoo ERP ecosystem; designed satellite operational systems
• Integrated production machinery workflows; scaled to 200,000+ orders with improved peak reliability`,
    sort_order: 2,
  },
  {
    company: "Aswhite Global",
    role_title: "Team Leader / Application Support Manager",
    location: null,
    start_date: "2014-01-01",
    end_date: "2018-01-01",
    description: `Modernization for large-scale commerce and finance systems.

• Delivered systems saving clients ~$3M annually; led Scrum/Kanban engineering teams
• Modernized fragmented legacy systems; improved operational workflows and integrations
• Employee of the Year; Top 3 IT Cup (Team Leader); Top 5 Microsoft Imagine Cup Vietnam (Team Leader)`,
    sort_order: 3,
  },
];

export const baoDangSampleSkills: SampleSkillSeed[] = [
  { category: "Leadership", name: "Executive technology strategy", proficiency: null, sort_order: 0 },
  { category: "Leadership", name: "Engineering organization scaling", proficiency: null, sort_order: 1 },
  { category: "Architecture", name: "Distributed & event-driven systems", proficiency: null, sort_order: 2 },
  { category: "Architecture", name: "API-first & microservices", proficiency: null, sort_order: 3 },
  { category: "Cloud", name: "AWS", proficiency: null, sort_order: 4 },
  { category: "Cloud", name: "Azure", proficiency: null, sort_order: 5 },
  { category: "Cloud", name: "Kubernetes & Docker", proficiency: null, sort_order: 6 },
  { category: "Backend", name: "Golang", proficiency: null, sort_order: 7 },
  { category: "Backend", name: "Node.js / NestJS", proficiency: null, sort_order: 8 },
  { category: "Frontend", name: "React", proficiency: null, sort_order: 9 },
  { category: "Data & AI", name: "OpenAI / LLM workflows", proficiency: null, sort_order: 10 },
  { category: "Data & AI", name: "Python · Pandas · scikit-learn", proficiency: null, sort_order: 11 },
  { category: "Commerce", name: "Shopify ecosystems", proficiency: null, sort_order: 12 },
  { category: "Commerce", name: "Marketplace integrations (Amazon, Walmart, TikTok Shop)", proficiency: null, sort_order: 13 },
];
