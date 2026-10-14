// All site copy and links live here. Edit text in this file only; components read from it.
// A link whose URL is still TODO is set to null and is not rendered on the page.
// It appears automatically once a real URL is added.
//
// `highlight` marks the word or phrase in a headline drawn in the accent color with a
// squiggle underline. It must appear exactly as written inside its headline.
// Lines marked FILLER are placeholder copy to review before launch.

export type Link = {
  label: string;
  href: string | null;
};

export type Headline = {
  text: string;
  highlight: string;
  keepCase?: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  readout: string;
  chips: string[];
  href: string | null;
};

export type Role = {
  role: string;
  company: string;
  dates: string;
  opsLog: string;
  bullets: string[];
};

// TODO: add email address (e.g. "name@domain.com"). While null, the Email button is hidden.
const email: string | null = null;

export const site = {
  name: "Ezeh Ikenna",

  nav: {
    wordmark: { text: "ezeh", dot: "." },
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Toolkit", href: "#toolkit" },
      { label: "Contact", href: "#contact" },
    ] satisfies Link[],
    cta: { label: "get in touch →", href: "#contact" } satisfies Link,
  },

  hero: {
    label: "AI Product Manager | AI Systems Builder",
    name: "Ezeh Ikenna",
    tagline: "Founder, Rithma Labs",
    status: "building agentic systems from Nigeria",
    headline: { text: "build.\nship.\nevaluate.", highlight: "evaluate." } satisfies Headline,
    intro:
      "10+ years running teams and operations systems taught me where companies lose time, money, and trust. I map how your team works, redesign the slow parts around AI agents, and trace every decision they make so each one can be audited and improved.",
    primary: { label: "view my work →", href: "#work" } satisfies Link,
    secondary: { label: "get in touch", href: "#contact" } satisfies Link,
    // Project lines are generated from work.projects below.
    flightLog: {
      header: "flight log",
      command: "$ status",
      status: (count: number) => `> online · ${count} systems in range`,
    },
    note: "follow the plane",
  },

  banner: {
    phrase: "evals ✦ regression ✦ security ✦ governance ✦",
  },

  about: {
    label: "01 / About",
    headline: { text: "operator lens.", highlight: "operator" } satisfies Headline,
    paragraphs: [
      "I came to AI from the operator's side, after co-founding a fashion retail brand and running operations systems at Standard Chartered.",
      "Since 2024, through Rithma Labs, I've designed and shipped AI for clients in logistics, construction, SaaS, and energy.",
    ],
  },

  work: {
    label: "02 / Work",
    headline: {
      text: "POCs specced.",
      highlight: "specced",
      keepCase: true,
    } satisfies Headline,
    note: "the code is all on GitHub",
    panelStatus: "public repo",
    linkLabel: "View on GitHub",
    projects: [
      {
        id: "scan-llm-wiki",
        name: "LLM Wiki",
        description:
          "A knowledge base that answers staff questions from company policy, with a citation behind every answer.",
        readout: "36 automated tests passing in CI",
        chips: ["LangGraph", "FastAPI", "Qdrant", "Postgres", "Claude"],
        href: "https://github.com/Ezeh8/llm_wiki",
      },
      {
        id: "scan-tool-access",
        name: "Tool Access Controller",
        description:
          "A security layer that controls which tools an AI agent may call, with instant revocation and a full audit trail.",
        readout: "12 MCP tools behind token auth / live revocation",
        chips: ["FastAPI", "FastMCP", "PostgreSQL", "Docker"],
        href: "https://github.com/Ezeh8/Tool-access-controller",
      },
      {
        id: "scan-invoice",
        name: "Invoice Exception Handler",
        description:
          "An agent that checks vendor invoices against purchase orders and flags price gaps, duplicates, and missing POs. This repo is the public eval build of a client deployment.",
        readout: "peak-week capacity 50 → 200+ invoices",
        chips: ["Rule engine", "LLM judgment", "Slack", "Google Sheets", "CI"],
        href: "https://github.com/Ezeh8/Invoice-exception-handler-eval",
      },
      {
        id: "scan-command-centre",
        name: "Command Centre",
        description:
          "A scheduled agent that researches, verifies, and republishes a daily briefing to one stable page, with no one watching.",
        readout: "runs unattended every morning / one stable URL",
        chips: ["Scheduled agent", "Live web search", "Persistent memory", "HTML/CSS/JS"],
        href: "https://github.com/Ezeh8/command-centre",
      },
    ] satisfies Project[],
  },

  experience: {
    label: "03 / Experience",
    headline: { text: "where the work happened.", highlight: "happened" } satisfies Headline,
    // Numbers in the bullets drawn with a marker highlight (matched as whole numbers).
    markers: ["85%", "₦17M+", "4", "35", "1,000+", "7,000+", "50", "200"],
    roles: [
      {
        role: "Founder",
        company: "Rithma Labs",
        dates: "Sept 2024 – Present",
        opsLog: "deploy · agentic systems for logistics, construction, saas, energy",
        bullets: [
          "Cut admin overhead by 85% for a logistics firm by building an n8n pipeline that routes CRM and deal data into billing and project tools, with a guardrail step for edge cases.",
          "Deployed the Invoice Exception Handler for a global construction firm, raising peak-week capacity from about 50 to over 200 invoices.",
          "Won back ₦17M+ in revenue in two months for a Nigerian SaaS company with a prompt-engineered churn-reduction system.",
          "Delivered an integration blueprint for an energy multinational across SAP ERP, SLB Lumi, Avocet, AVEVA PI, and SCADA.",
        ],
      },
      {
        role: "Operations Systems Partner",
        company: "Standard Chartered Bank",
        dates: "Aug 2021 – Dec 2024",
        opsLog: "operate · automation, kyc, credit scoring",
        bullets: [
          "Monitored in-app automation for real-time customer engagement and support.",
          "Rolled out a digital KYC verification platform aligned with Central Bank of Nigeria requirements.",
          "Operationalized an AI-driven credit-scoring model with the data science team.",
        ],
      },
      {
        role: "Co-Founder & COO",
        company: "Ropa Brand",
        dates: "Feb 2014 – Mar 2021",
        opsLog: "scale · 4 → 35 people",
        bullets: [
          "Scaled the team from 4 to 35 people.",
          "Served 1,000+ bespoke and 7,000+ retail customers.",
          "Managed local manufacturing partners and international suppliers for labels, packaging, and specialist materials.",
        ],
      },
    ] satisfies Role[],
  },

  toolkit: {
    label: "04 / Toolkit",
    headline: { text: "the kit behind the work.", highlight: "work" } satisfies Headline,
    groups: [
      { title: "Build", items: ["Python", "FastAPI", "PostgreSQL", "Docker", "Claude Code", "Codex"] },
      { title: "Agents", items: ["LangGraph", "MCP", "RAG pipelines", "LLM APIs"] },
      {
        title: "Evaluate",
        items: ["LangSmith", "Langfuse", "Golden datasets", "Regression suites"],
      },
      {
        title: "Automate",
        items: ["n8n", "Zapier", "GoHighLevel", "Google Workspace"],
      },
    ],
  },

  contact: {
    headline: { text: "get in touch.", highlight: "touch" } satisfies Headline,
    text: "Based in Nigeria and working remotely across time zones. I'm open to AI product and operations roles, so if you're building where AI meets operations, say hello.",
    email: email as string | null,
    buttons: [
      { label: "Email", href: email ? `mailto:${email}` : null },
      { label: "LinkedIn", href: null }, // TODO: add LinkedIn profile URL
      { label: "GitHub", href: "https://github.com/Ezeh8" },
    ] satisfies Link[],
    replies: "replies within 24 hours", // TODO: confirm before launch
  },

  footer: {
    credentials: {
      label: "Education and certifications",
      items: [
        "B.Sc. Business Administration, University of Lagos",
        "Introduction to Model Context Protocol (Anthropic)",
        "Introduction to Agent Skills (Anthropic)",
        "Deploy Multi-Agent Systems with Gemini Enterprise Agent Platform (Google)",
      ],
    },
    line: "Agents and blockchain are the twin rails of the next economy; I've been in Nigeria's crypto community for 4+ years, watching them converge.",
    copyright: "© 2026 Ezeh Ikenna",
  },
};
