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
  // how many bullets the card shows from md up until opened (default 2)
  pointsMd?: number;
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
    status: "building agentic systems globally",
    // The headline: the prefix over one word that rotates through `words`. Screen readers
    // get `headlineLabel` instead.
    prefix: "i map the",
    words: ["gaps", "friction", "flow"] as const,
    headlineLabel: "I map the gaps, friction and flow.",
    body: "I am not that interested in Agents, I am interested in the structure underneath ~ the handoffs, the workflow gaps, the 5-minute decision that stalls for 48 hours. My approach is to re-imagine the process, then build agents into it.",
    primary: { label: "view my work →", href: "https://github.com/Ezeh8" } satisfies Link,
    // Opens in a new tab. The file lives at public/ezeh_cv.pdf.
    secondary: { label: "view my CV →", href: "/ezeh_cv.pdf" } satisfies Link,
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
        description: "Acts as a centralized, privacy-first knowledge engine for complex organization policies, standard operating procedures, and internal documentation. Operations and support teams query the system in natural language to retrieve verified, context-aware answers instantly, integrating directly into Zendesk to reduce internal support ticket volume by 65%.",
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
        description: "Built an automated churn-prediction and personalized re-engagement pipeline. Triggered by purchase dormancy and contact decay, leveraging prompt-engineered LLM sequences to deliver targeted WhatsApp and email outreach, cutting 60-day churn by 33% and recovering over ₦17M in dormant customer lifetime value within two months.",
        deployedResult: "60-day churn down 33% · ₦17M+ recovered in two months",
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
        id: "command-centre",
        title: "Command Centre",
        subtitle: "Autonomous Daily Briefing & Research Engine",
        description: "Sets up an unattended, daily-scheduled agent that rebuilds and republishes an always-current HTML/CSS/JS dashboard in place, using live web research and a persistent memory store. Built for long-term production use, it combines full-replace state management, primary-source verification, quiet-failure detection, and daily pipeline reconciliation, so it runs without human oversight and without piling up log clutter.",
        deployedResult: "Daily unattended runs · one always-current dashboard",
        stack: ["Python", "LangGraph", "Scheduled Workflows", "Persistent Memory"],
        github: "https://github.com/Ezeh8",
      },
    ] as const satisfies readonly Project[],
  },

  experience: {
    label: "03 / EXPERIENCE SO FAR",
    headline: { text: "a decade of work.", highlight: "decade" } satisfies Headline,
    // Numbers in the bullets drawn with a marker highlight (matched as whole numbers).
    markers: ["quadrupling", "security boundaries", "ticket volume by 65%", "60-day churn by 33%", "strict SLAs", "SQL query pipelines", "4 to 35", "7,000 customer", "99% accuracy", "consistently reliable"],
    roles: [
      {
        role: "Founder",
        company: "Rithma Labs (Global AI & Systems Consulting)",
        dates: "Sept 2024 – Present",
        opsLog: "DEPLOYING AGENTIC SYSTEMS GLOBALLY",
        bullets: [
          "Invoice Exception Handler ~ Plugs into financial and ERP workflows to automatically scan incoming vendor purchase orders against bills using containerized local LLMs. Isolates line-item pricing discrepancies, tax mismatches, or missing delivery receipts, routing only non-standard exceptions to human managers while passing clean invoices straight to payment processing—quadrupling invoice processing capacity during peak weeks.",
          "LLM Wikipedia ~ Acts as a centralized, privacy-first knowledge engine for complex organization policies, standard operating procedures, and internal documentation. Operations and support teams query the system in natural language to retrieve verified, context-aware answers instantly, integrating directly into Zendesk to reduce internal support ticket volume by 65%.",
          "Retention AI Engine ~ Built an automated churn-prediction and personalized re-engagement pipeline. Triggered by purchase dormancy and contact decay, leveraging prompt-engineered LLM sequences to deliver targeted WhatsApp and email outreach, cutting 60-day churn by 33% and recovering over ₦17M in dormant customer lifetime value within two months.",
          "Command Centre ~ Sets up an unattended, daily-scheduled agent that rebuilds and republishes an always-current HTML/CSS/JS dashboard in place, using live web research and a persistent memory store. Built for long-term production use, it combines full-replace state management, primary-source verification, quiet-failure detection, and daily pipeline reconciliation, so it runs without human oversight and without piling up log clutter.",
          "Integration Blueprint ~ Delivered a technical integration blueprint for an energy-sector multinational, mapping data pipelines across enterprise systems (SAP ERP, SLB Lumi, Avocet) and field OT systems (AVEVA PI, SCADA). Established Model Context Protocol (MCP) data architecture and security boundaries to lay the technical foundation for a later enterprise-wide AI rollout.",
        ],
        pointsMd: 1,
      },
      {
        role: "Operations Systems Partner",
        company: "Standard Chartered Bank",
        dates: "Aug 2021 – Dec 2024",
        opsLog: "Python, SQL, SAP ERP, Jira, QuickBooks",
        bullets: [
          "Monitored the bank's real-time customer engagement pipelines via SAP ERP and Jira Service Management, flagging operational exceptions and coordinating escalation workflows with cross-functional teams under strict SLAs.",
          "Partnered with data science teams to deploy an AI credit-scoring model, utilizing Power BI dashboards to monitor Python model default-risk outputs and support credit risk acceptance decisions.",
          "Collaborated with compliance and engineering teams to roll out a digital KYC verification platform using REST APIs and SQL query pipelines aligned with Central Bank of Nigeria requirements.",
          "Built and managed cross-functional workflow tracking systems in Jira and QuickBooks, optimizing resource allocation and project throughput across core financial operations.",
        ],
      },
      {
        role: "Co-Founder & Chief Operating Officer (COO)",
        company: "Ropa Brand",
        dates: "Feb 2014 – Mar 2021",
        opsLog: "Zendesk, QuickBooks, Excel, Sheets, Logistics APIs",
        bullets: [
          "Founded and scaled an independent fashion retail brand from 4 to 35 team members, utilizing QuickBooks and Excel for daily financial monitoring, vendor management, and operating performance.",
          "Managed international supply chain logistics across fabric sourcing and garment manufacturing using Slack and AirTable databases, supporting over 7,000 customer transactions across bespoke and retail service.",
          "Designed an automated Google Sheets fulfillment system integrated with GIG & FedEx API webhooks to track inventory and manage local courier deliveries across extensive SKUs with 99% accuracy.",
          "Rolled out standardized operating procedures (SOPs) across customer service, delivery and return handling in Zendesk ~ deploying custom ticket routing, automated macro triggers, and SLA escalation paths that cut order dispatch cycle times and delivered a consistently reliable customer experience.",
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
    email: email as string | null,
    buttons: [
      { label: "send me an email →", href: `mailto:${email}`, primary: true },
      { label: "view my work →", href: "https://github.com/Ezeh8", primary: true },
      { label: "view my CV →", href: "/ezeh_cv.pdf", primary: true },
    ] satisfies Link[],
    replies: "building systems globally",
  },

  footer: {
    credentials: {
      label: "TELL ME EVERYTHING",
      text: "I work remotely, across time zones, so wherever your business is, let’s talk ~ I want to hear about the AI tool(s) you’ve adopted so far and your most manual task. Together, we’ll rebuild your workflows and processes.",
    },
    // Round icon buttons under the "Tell Me Everything" note. The label names the icon.
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ezeh-ikenna-a3350b307" },
      { label: "X", href: "https://x.com/ezeh8_8" },
      { label: "TikTok", href: "https://www.tiktok.com/@ezeh8_8" },
      { label: "GitHub", href: "https://github.com/Ezeh8" },
    ] satisfies Link[],
    copyright: "© 2026 Ezeh Ikenna",
  },
};
