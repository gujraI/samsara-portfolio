export type MetaItem = {
  text: string;
  href?: string;
  note?: string;
};

export type Experience = {
  role: string;
  org: string;
  /** slug under src/assets/logos/, e.g. "oracle" -> oracle.svg */
  logo: string;
  /** display string, e.g. "jul 2026 — present" */
  period: string;
  /** ISO year-month the role started, used to derive uptime */
  start: string;
  /** marks the role used for the neofetch `uptime` line */
  current?: boolean;
  /** org · type · place, each item optionally a link with a trailing note */
  meta: MetaItem[];
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "member of technical staff",
    org: "oracle",
    logo: "oracle",
    period: "jul 2026 — present",
    start: "2026-07",
    current: true,
    meta: [{ text: "full-time" }, { text: "bengaluru · on-site" }],
    points: [
      "full-stack engineer on Oracle Data Safe, contributing across the Discovery & Masking and UI teams.",
      "deliver end-to-end features spanning frontend and backend in a high-velocity engineering environment.",
    ],
  },
  {
    role: "software consultant",
    org: "growth grids",
    logo: "growth-grids",
    period: "dec 2025 — mar 2026",
    start: "2025-12",
    meta: [{ text: "freelance" }, { text: "remote" }],
    points: [
      "built a high-throughput CV extraction platform with React (shadcn/ui), FastAPI, PaddleOCR, Gemini 2.5 Flash Lite and MongoDB — PDF/DOCX ingestion, OCR, LLM-based structuring and rule-based normalization.",
      "cut end-to-end resume processing from 40s to 5s against the in-house solution, validated at a scale of 100,000+ CVs, and added bulk parsing through the Gemini Batch API.",
      "designed a modular, Dockerized architecture with interchangeable OCR (PaddleOCR/Tesseract) and multiple LLM backends — including locally hosted models on NVIDIA A100-powered GCP infrastructure — plus manual review/editing workflows.",
    ],
  },
  {
    role: "software developer",
    org: "delta force · NIT trichy",
    logo: "delta-force",
    period: "aug 2023 — mar 2025",
    start: "2023-08",
    meta: [
      {
        text: "delta.nitt.edu",
        href: "https://delta.nitt.edu",
        note: "first web-dev project :0",
      },
    ],
    points: [
      "contributed to app and web projects across a wide range of stacks, including mobile apps and web-based games for college fests.",
      "authored technical blogs for the club website, designed promotional posters, and mentored junior members.",
    ],
  },
];
