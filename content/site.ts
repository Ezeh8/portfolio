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
  primary?: boolean;
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
  tinted?: boolean;
};

export type Role = {
  role: string;
  company: string;
  dates: string;
  opsLog: string;
  bullets: string[];
  tinted?: boolean;
};

const email = "ezehkena@gmail.com";

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
    headline: { text: "build. ship. evaluate.", highlight: "evaluate." } satisfies Headline,
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
        tinted: true,
      },
    ] satisfies Project[],
  },

  experience: {
    label: "03 / Experience",
    headline: { text: "where the work happened.", highlight: "happened" } satisfies Headline,
    // Numbers in the bullets drawn with a marker highlight (matched as whole numbers).
    markers: ["85%", "₦17 million", "4", "35", "1,000", "7,000", "quadrupling"],
    roles: [
      {
        role: "Founder",
        company: "Rithma Labs (Global AI & Systems Consulting)",
        dates: "Sept 2024 – Present",
        opsLog: "deploy · agentic systems for logistics, construction, saas, energy",
        bullets: [
          "Built an n8n pipeline for an enterprise logistics company, routing CRM and deal data to billing and project tools with a guardrail step for edge cases, cutting admin overhead 85%",
          "Deployed a self-hosted AI model for a global construction firm, evaluated against sandbox cases before going live, quadrupling invoice processing capacity during peak weeks",
          "Built a churn-reduction system for a Nigerian SaaS company using a prompt-engineered LLM to personalize outreach, winning back over ₦17 million in revenue within two months",
          "Delivered a technical integration blueprint for an energy-sector multinational, mapping data pipelines across enterprise systems (SAP ERP, SLB Lumi, Avocet) and field OT systems (AVEVA PI, SCADA) to lay the foundation for a later AI rollout",
        ],
      },
      {
        role: "Operations Systems Partner",
        company: "Standard Chartered Bank",
        dates: "Aug 2021 – Dec 2024",
        opsLog: "operate · automation, kyc, credit scoring",
        bullets: [
          "Monitored the bank's in-app automation for real-time customer engagement and support, flagging issues and coordinating fixes with cross-functional teams",
          "Collaborated with compliance and engineering teams to roll out a digital KYC verification platform aligned with Central Bank of Nigeria requirements",
          "Partnered with the data science team to operationalize an AI-driven credit-scoring model, monitoring borrower default-risk outputs to support acceptance decisions and reduce credit losses",
          "Built and managed operational workflows and tracking systems for cross-functional project management, optimizing resource allocation across initiatives",
        ],
        tinted: true,
      },
      {
        role: "Co-Founder & Chief Operating Officer (COO)",
        company: "Ropa Brand",
        dates: "Feb 2014 – Mar 2021",
        opsLog: "scale · 4 → 35 people",
        bullets: [
          "Founded and scaled an independent fashion retail brand from 4 to 35 team members, overseeing daily operations, hiring, and revenue growth",
          "Managed international vendor relationships across fabric sourcing, garment manufacturing, and custom packaging, supporting over 1,000 bespoke and 7,000 retail customer transactions",
          "Structured end-to-end inventory tracking and fulfillment workflows with domestic and international courier partners to maintain order accuracy and delivery timelines",
          "Implemented standardized operating procedures across customer service, order dispatch, and returns handling, cutting cycle times and operational friction as order volumes grew",
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
        tinted: true,
      },
      {
        title: "Automate",
        items: ["n8n", "Zapier", "GoHighLevel", "Google Workspace"],
      },
    ],
  },

  contact: {
    headline: { text: "get in touch.", highlight: "touch" } satisfies Headline,
    text: "Tell me about your business, the AI you've adopted so far, and what you want this engagement to achieve. I'm based in Nigeria and work remotely across time zones.",
    email: email as string | null,
    buttons: [
      { label: "get in touch →", href: `mailto:${email}`, primary: true },
      { label: "view my work →", href: "https://github.com/Ezeh8", primary: true },
      { label: "LinkedIn", href: null }, // TODO: add LinkedIn profile URL
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
