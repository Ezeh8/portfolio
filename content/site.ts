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
};

export type Role = {
  role: string;
  company: string;
  dates: string;
  opsLog: string;
  bullets: string[];
};

const email = "ezehkena@gmail.com";

export const site = {
  name: "Ezeh Ikenna",

  nav: {
    wordmark: { text: "ezeh", dot: "." },
    links: [
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Toolkit", href: "#toolkit" },
      { label: "Contact", href: "#contact" },
    ] satisfies Link[],
  },

  hero: {
    label: "AI Product Manager | AI Systems Builder",
    name: "Ezeh Ikenna",
    tagline: "Founder, Rithma Labs",
    status: "building agentic systems from Nigeria",
    // The headline: the prefix over one word that rotates through `words`. Screen readers
    // get `headlineLabel` instead.
    prefix: "i map the",
    words: ["gaps", "friction", "flow"] as const,
    headlineLabel: "I map the gaps, friction and flow.",
    body: "I'm not that interested in Agents ~ I'm interested in the processes, the handoffs, the 5-minute decision that stalls for 48 hours. I re-imagine the process, then build the agent in around it.",
    primary: { label: "see what I'm building →", href: "https://github.com/Ezeh8" } satisfies Link,
    // Downloads straight away. The file lives at public/Ezeh-Ikenna-CV.pdf.
    secondary: { label: "download CV", href: "/Ezeh-Ikenna-CV.pdf" } satisfies Link,
    // Project lines are generated from work.projects below.
    flightLog: {
      header: "flight log",
      command: "$ status",
      status: (count: number) => `> ACTIVE! · ${count} systems in range`,
    },
    note: "follow the plane",
  },

  banner: {
    phrase: "AI security ✦ regression suites ✦ AI governance ✦ evals metrics ✦",
  },

  work: {
    label: "02 / Work",
    headline: {
      text: "see what I am building",
      highlight: "building",
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
    headline: { text: "a decade of work.", highlight: "decade" } satisfies Headline,
    // Numbers in the bullets drawn with a marker highlight (matched as whole numbers).
    markers: ["cutting admin overhead 85%", "₦17 million in revenue", "in-app automation", "AI-driven credit-scoring model", "1,000", "7,000", "cycle times", "operational friction"],
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
      { title: "Build", items: ["Python", "FastAPI", "PostgreSQL", "Docker", "Claude Code / Codex"] },
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
    text: "Tell me about your business, the AI you've adopted so far, and what you want this engagement to achieve. I'm based in Nigeria and work remotely across time zones.",
    email: email as string | null,
    buttons: [
      { label: "get in touch →", href: `mailto:${email}`, primary: true },
      { label: "see what I'm building →", href: "https://github.com/Ezeh8", primary: true },
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
    // Round icon buttons under the education list. The label names the icon.
    socials: [
      { label: "X", href: "https://x.com/ezeh8_8" },
      { label: "TikTok", href: "https://www.tiktok.com/@ezeh8_8" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ezeh-ikenna-a3350b307" },
    ] satisfies Link[],
    copyright: "© 2026 Ezeh Ikenna",
  },
};
