// All site copy and links live here. Edit text in this file only; components read from it.
// A link whose URL is still TODO is set to null and is not rendered on the page.
// It appears automatically once a real URL is added.
//
// `highlight` marks the word or phrase in a headline drawn in the accent color. It must
// appear exactly as written inside its headline.
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
  title: string;
  subtitle: string;
  description: string;
  deployedResult: string;
  stack: readonly string[];
  // the card's "View →" link; "" shows no link
  github: string;
  // keeps the title on one line, shrinking it to fit the card where needed
  oneLine?: boolean;
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
      { label: "About", href: "#about" },
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
    body: "I am not that interested in Agents, I am interested in the structure underneath ~ the handoffs, the workflow gaps, the 5-minute decision that stalls for 48 hours. My approach is to re-imagine the process, then build agents into it.",
    primary: { label: "view my work →", href: "https://github.com/Ezeh8" } satisfies Link,
    // Downloads straight away. The file lives at public/ezeh_cv.pdf.
    secondary: { label: "download CV ↓", href: "/ezeh_cv.pdf" } satisfies Link,
    // Typed out line by line as the page opens; "$ " lines are commands, the rest their
    // output, and "" leaves a gap between groups.
    flightLog: {
      header: "ezeh@pm - re-building processes",
      lines: [
        "$ /who.am.i?",
        "applied AI pm · operations engineer · across time-zones",
        "",
        "$ /current-focus",
        "llm agents · systems building · ai security & governance",
        "",
        "$ /sop: spec - evaluate - log",
        "✓ mapped · shipped · live",
        "✓ process rebuild",
      ],
    },
    note: "follow the plane",
  },

  banner: {
    phrase: "AI security ✦ regression suites ✦ AI governance ✦ evals metrics ✦",
  },

  about: {
    label: "01 / ABOUT ME",
    headline: {
      // line breaks: the \n breaks are kept by the About headline (whitespace-pre-line)
      text: "i own the maps & specs\nbefore the code.",
      highlight: "maps & specs",
      keepCase: true,
    } satisfies Headline,
    paragraphs: [
      "I’ve spent the last few years in banking infrastructure, high-end retail operations, an AI agency, and now in AI infrastructure. The industries kept changing, the work didn’t.",
      "Every time, the actual job was the same: find the part of the system that’s quietly costing everyone time, and rebuild it so nobody has to think about it again.",
    ],
    // "the whole story": the button under the paragraphs opens it in the card-style
    // overlay. `steps` sit between the paragraphs at `stepsAfter`; `hello` closes it and
    // goes to #contact.
    storyButton: "the whole story",
    story: [
      "Every team I've worked with had the same problem: plenty of people ready to build, and nobody holding a clear picture of what to build next. Enter Ezeh, I became that person ~ the one who brings clarity.",
      "Seven years running The Ropa Brand, a fashion retail company that grew from 4 people to 35, taught me that teams move fastest when the hard thinking happens first ~ when the process is mapped end to end, documented, and the success metrics are locked in before the build begins.",
      "Standard Chartered reinforced the same lesson ~ I ran operations systems across in-app automation, digital KYC rollout, and AI-driven credit scoring. The deployments that stuck were the ones where we coordinated around the SOPs, locked the KPIs, and set the SLAs before the tech went live. The ones that failed were coordination disasters ~ someone just said \"build XYZ system\" without asking why, for whom, what success looks like, or what we're not doing.",
      "Now, through Rithma Labs ~ an AI transformation company, I'm still doing the exact same thing.",
      "That's the approach I take with every build: most people attach agents to every business system to capitalize on speed ~ I re-imagine your processes first, then attach agents to capitalize on efficiency.",
    ],
    stepsAfter: 4,
    steps: [
      "I map the process end to end, defining what success looks like.",
      "I write the documentation ~ PRD and TDD.",
      "I build the agents and infrastructure around that clarity.",
      "I evaluate and test whether it works.",
      "I demo the results to the team.",
      "I push to production when it's proven.",
    ],
    hello: { before: "If you want to adopt agents the right way ~ ", label: "say hello", href: "#contact" },
  },

  work: {
    label: "02 / WORK IN PROGRESS",
    headline: {
      text: "see what I am building...",
      highlight: "building",
      keepCase: true,
    } satisfies Headline,
    panelStatus: "public repo",
    linkLabel: "View on GitHub",
    seeAll: "See all →",
    projects: [
      {
        id: "invoice-handler",
        title: "Invoice Exception Handler",
        subtitle: "Automated Accounts Payable Reconciliation & Audit",
        description: "Plugs into financial and ERP workflows to automatically scan incoming vendor purchase orders against bills using containerized local LLMs. Isolates line-item pricing discrepancies, tax mismatches, or missing delivery receipts, routing only non-standard exceptions to human managers while passing clean invoices straight to payment processing—quadrupling invoice processing capacity during peak weeks.",
        deployedResult: "50 → 200+ invoices processed per week at peak",
        stack: ["FastAPI", "PostgreSQL", "Ollama / Qwen-2.5"],
        github: "https://github.com/Ezeh8/Invoice-exception-handler-eval",
      },
      {
        id: "llm-wiki",
        title: "LLM Wikipedia",
        subtitle: "Internal SOP & Compliance Knowledge Retrieval",
        description: "Acts as a centralized, privacy-first knowledge engine for complex organization policies, standard operating procedures, and internal documentation. Operations and support teams query the system in natural language to retrieve verified, context-aware answers instantly, integrating directly into Zendesk to reduce internal support ticket volume by 60% and slash onboarding turnaround.",
        deployedResult: "4 live SOPs · 29 regression tests · weekly drift check · CI/CD gate",
        stack: ["LangGraph", "Qdrant (RAG)", "FastAPI"],
        github: "https://github.com/Ezeh8/llm_wiki",
      },
      {
        id: "ai-governance",
        title: "AI security & Governance",
        subtitle: "Enterprise Agent Governance & Role-Based Access Control (RBAC)",
        description: "Serves as a security and authorization gateway for autonomous AI agents operating across enterprise IT stacks. Sets hard boundaries on agent tool execution—defining exact permission scopes, enforcing approval gates for sensitive API calls, and generating immutable audit logs to ensure compliance across complex operational environments.",
        deployedResult: "7 security steps live-tested · RBAC + ABAC + server-derived audit trail",
        stack: ["Model Context Protocol (MCP)", "FastAPI", "Agent Governance"],
        github: "https://github.com/Ezeh8/Tool-access-controller",
      },
      {
        id: "ops-sync",
        title: "Operation sync. System",
        subtitle: "Cross-Departmental Webhook Engine for Logistics",
        description: "Synchronizes CRM, billing, and inventory pipelines across HubSpot, Stripe, and Asana to eliminate manual double-handling. Orchestrates real-time data flows across departments with built-in human-in-the-loop guardrails for edge cases, cutting administrative overhead by 85% and saving 15 hours of manual labor per week.",
        deployedResult: "85% less admin overhead · 15 hours saved per week",
        stack: ["n8n", "Webhooks", "Logistics Ops"],
        github: "",
      },
      {
        id: "retention-ai",
        title: "Retention AI Engine",
        subtitle: "Automated Churn Prediction & Customer Winback",
        description: "Engineers automated churn-prediction and personalized re-engagement pipelines triggered by purchase dormancy and contact decay. Leverages prompt-engineered LLM sequences to deliver targeted WhatsApp and email outreach, cutting 90-day churn by 21% and recovering over ₦17M in dormant customer lifetime value within two months.",
        deployedResult: "90-day churn down 21% · ₦17M+ recovered in two months",
        stack: ["GoHighLevel", "GPT-4o", "WhatsApp API"],
        github: "",
      },
      {
        id: "zen-onboarding",
        title: "Zen. Onboarding Engine",
        subtitle: "Automated Client Provisioning & Support Triage",
        description: "Automates end-to-end client onboarding upon payment verification by dynamically auto-generating PandaDoc contracts, setting up Google Drive workspaces, and routing onboarding tickets into Zendesk. Eliminates administrative bottlenecks to slash client onboarding turnaround time from 48 hours to under 15 minutes.",
        deployedResult: "Onboarding 48 hours → under 15 minutes",
        stack: ["n8n", "Zendesk", "Stripe API"],
        github: "",
      },
      {
        id: "energy-blueprint",
        title: "Integration Blueprint",
        oneLine: true,
        subtitle: "Enterprise Data Architecture & Field OT Mapping",
        description: "Delivered a technical integration blueprint for an energy-sector multinational, mapping data pipelines across enterprise systems (SAP ERP, SLB Lumi, Avocet) and field OT systems (AVEVA PI, SCADA). Established Model Context Protocol (MCP) data architecture and security boundaries to lay the technical foundation for a later enterprise-wide AI rollout.",
        deployedResult: "Enterprise + field OT systems mapped for an AI rollout",
        stack: ["SAP / AVEVA PI", "MCP", "Enterprise Architecture"],
        github: "",
      },
      {
        id: "claude-intelligence",
        title: "Claude Intelligence Engine",
        subtitle: "Autonomous Scheduled Research & Persistent Dashboard Pipeline",
        description: "Engineers an unattended, daily-scheduled AI agent that pulls from live web sources and persistent memory stores to republish a single, always-current dashboard without manual intervention. Features automated state reconciliation, stale-data suppression, and quiet-failure detection mechanisms to maintain data freshness and prevent accumulating log clutter over long-term execution runs.",
        deployedResult: "Daily unattended runs · one always-current dashboard",
        stack: ["Python", "LangGraph", "Automated Workflows"],
        github: "https://github.com/Ezeh8",
      },
    ] as const satisfies readonly Project[],
  },

  experience: {
    label: "03 / EXPERIENCE SO FAR",
    headline: { text: "a decade of work.", highlight: "decade" } satisfies Headline,
    // Numbers in the bullets drawn with a marker highlight (matched as whole numbers).
    markers: ["cutting admin overhead 85%", "₦17 million in revenue", "in-app automation", "AI-driven credit-scoring model", "1,000", "7,000", "cycle times", "operational friction"],
    roles: [
      {
        role: "Founder",
        company: "Rithma Labs (Global AI & Systems Consulting)",
        dates: "Sept 2024 – Present",
        opsLog: "DEPLOYING AGENTIC SYSTEMS GLOBALLY",
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
        opsLog: "AUTOMATION, KYC, CREDIT SCORING",
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
    label: "04 / THE TOOLKIT I USE",
    headline: { text: "the kit behind the work.", highlight: "work" } satisfies Headline,
    groups: [
      { title: "Build", items: ["Python", "FastAPI", "PostgreSQL", "Docker / AWS", "Claude Code / Codex"] },
      { title: "Agents", items: ["LangGraph", "Chroma DB", "RAG pipelines", "MCP / LLM APIs"] },
      {
        title: "Evaluate",
        items: ["Langfuse", "LangSmith", "Golden datasets", "Regression suites"],
      },
      {
        title: "Automate",
        items: ["n8n", "Zapier", "Google Workspace", "GoHighLevel / HubSpot"],
      },
    ],
  },

  contact: {
    headline: { text: "get in touch.", highlight: "touch" } satisfies Headline,
    paragraphs: [
      "Tell me about your business, the AI you’ve adopted so far, and your most manual task. Let’s rebuild your workflows together.",
      "I’m based in Nigeria and work remotely across time zones.",
    ],
    email: email as string | null,
    buttons: [
      { label: "send me an email →", href: `mailto:${email}`, primary: true },
      { label: "view my work →", href: "https://github.com/Ezeh8", primary: true },
    ] satisfies Link[],
    replies: "replies within 72 hours",
  },

  footer: {
    credentials: {
      label: "Education and certifications",
      items: [
        "B.Sc. Business Administration",
        "Introduction to Agent Skills (Anthropic)",
        "Introduction to Model Context Protocol (Anthropic)",
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
