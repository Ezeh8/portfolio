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
  // view-only pages (images in public/) that "View →" opens in an overlay, when there
  // is no link
  pages?: readonly { src: string; alt: string }[];
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
    secondary: { label: "view my résumé →", href: "/ezeh_cv.pdf" } satisfies Link,
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
    // from 768px, where the headline sits in a narrow column: three lines, "before" up with
    // "& specs" and "the code." on a line of its own
    headlineWide: {
      text: "i own the maps\n& specs before\nthe code.",
      highlight: "maps\n& specs",
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
      "I’m an AI-native PM and operations specialist with 10+ years of hands-on experience across retail, banking, and B2B services. Across all of it, one lesson has held: teams move fastest when the hard thinking happens first, with the process mapped end to end, documented, and the success metrics locked in before the build begins.",
      "I first learned this over seven years running The Ropa Brand, a fashion retail company that grew from 4 people to 35.",
      "Standard Chartered confirmed it. There, I ran operations systems across in-app automation, digital KYC rollout, and AI-driven credit scoring. The deployments that stuck had their SOPs agreed, KPIs set, and SLAs signed off before the tech went live; the ones that failed began with someone saying “build XYZ system” and nobody asking why, for whom, what success looks like, or what was out of scope.",
      "Today, through Rithma Labs, my AI transformation company, I carry that same discipline into every engagement. Recent work includes a Multi-Tier Support Pipeline for a neobank (n8n, Zendesk, Slack), an Invoice Exception Handler for a construction company (FastAPI, PostgreSQL, Ollama), LLM Wikipedia, a legal knowledge engine for a law firm (LangGraph, GraphRAG), a Retention AI Engine for an e-commerce brand (GoHighLevel, WhatsApp, GPT-4o), and Operation Sync, which connects HubSpot, Stripe, and Asana for a logistics provider.",
      "Each one follows the same path:",
      "For over a decade I’ve set up processes from the ground up and redesigned the ones holding teams back; today I add AI where it makes them faster.",
    ],
    stepsAfter: 5,
    steps: [
      "I map the process end to end and define what success looks like.",
      "I write the documentation ~ PRD and a TDD.",
      "I build the agents and infrastructure around that clarity.",
      "I evaluate and test whether it works.",
      "I demo the results to the team.",
      "I push to production once it’s proven.",
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
    seeAll: "See all →",
    projects: [
      {
        id: "support-pipeline",
        title: "Multi-Tier Support Pipeline",
        oneLine: true,
        subtitle: "AI Support & Escalation System",
        description: "Worked directly with the CTO of a high-growth neobank to build automated customer service infrastructure from scratch. Connects the mobile app chat frontend to n8n, Zendesk, and Slack, forming a multi-tier support pipeline. An AI triage layer resolves queries with zero human touch, turns complex issues into context-rich Zendesk tickets, and sends real-time Slack alerts for high-priority operational and security escalations.",
        deployedResult: "",
        stack: ["Zendesk", "Slack", "n8n", "Webhooks"],
        github: "https://doux.finance/",
      },
      {
        id: "invoice-handler",
        title: "Invoice Exception Handler",
        subtitle: "Automated Accounts Payable Reconciliation & Audit",
        description: "Built for a construction company ~ Plugs into financial and ERP workflows and scans incoming vendor purchase orders against bills using containerized local LLMs. Isolates line-item pricing discrepancies, tax mismatches, and missing delivery receipts. Routes only non-standard exceptions to human managers via a dedicated Slack channel and sends clean invoices straight to payment processing.",
        deployedResult: "50 → 200+ invoices processed per week at peak",
        stack: ["Slack Webhooks", "FastAPI", "PostgreSQL", "Ollama"],
        github: "https://github.com/Ezeh8/Invoice-exception-handler-eval",
      },
      {
        id: "llm-wiki",
        title: "LLM Wikipedia",
        subtitle: "Internal SOP & Knowledge Retrieval Engine",
        description: "Acts as an enterprise knowledge engine for organizational policies, SOPs, and compliance documentation across growing businesses ~ most recently deployed for a full-service law firm to query legal precedents and case files down to clause-level citations. Employs GraphRAG and hybrid vector retrieval to resolve complex multi-hop queries in natural language with strict source attribution, cutting associate legal research time by up to 55%. Features Role-Based Access Control (RBAC) to enforce ethical walls and safeguard attorney-client privilege.",
        deployedResult: "4 live SOPs · 29 regression tests · weekly drift check · CI/CD gate",
        stack: ["LangGraph", "GraphRAG", "FastAPI", "Vector Database", "Zendesk API"],
        github: "https://github.com/Ezeh8/llm_wiki",
      },
      {
        id: "ai-governance",
        title: "AI security & Governance",
        subtitle: "Enterprise Agent Governance & Role-Based Access Control (RBAC)",
        description: "Serves as a security and authorization gateway for autonomous AI agents operating across enterprise IT stacks. Sets hard boundaries on agent tool execution ~ defining exact permission scopes, enforcing approval gates for sensitive API calls, and generating immutable audit logs to ensure compliance across complex operational environments.",
        deployedResult: "7 security steps live-tested · RBAC + ABAC + server-derived audit trail",
        stack: ["Model Context Protocol (MCP)", "Agent Governance", "FastAPI"],
        github: "https://github.com/Ezeh8/Tool-access-controller",
      },
      {
        id: "retention-ai",
        title: "Retention AI Engine",
        subtitle: "Automated Churn Prediction & Customer Winback",
        description: "Built for an e-commerce brand ~ this automated churn-prediction and re-engagement pipeline is triggered by purchase dormancy and contact decay. It uses LLM-written sequences to send targeted WhatsApp and email outreach, cutting 60-day churn by 33% and recovering over ₦17M in dormant customer lifetime value within two months.",
        deployedResult: "60-day churn down 33% · ₦17M+ recovered in two months",
        stack: ["n8n", "GoHighLevel", "WhatsApp API", "Paystack Webhooks", "GPT-4o"],
        github: "",
      },
      {
        id: "ops-sync",
        title: "Operation Sync. System",
        subtitle: "Cross-Departmental Webhook & ERP Orchestration",
        description: "Built for an enterprise logistics provider to synchronize CRM, billing, and inventory pipelines across HubSpot, Stripe, and Asana. Orchestrates real-time data flows between freight sales, operations, and dispatch teams, with human-in-the-loop guardrails for edge cases. Eliminates manual data entry across systems, cuts administrative overhead by 85%, and saves 15 hours of manual operational labor weekly.",
        deployedResult: "85% less admin overhead · 15 hours saved per week",
        stack: ["n8n", "HubSpot API", "Stripe Webhooks", "Asana API"],
        github: "",
      },
      {
        id: "energy-blueprint",
        title: "Integration Blueprint",
        oneLine: true,
        subtitle: "Enterprise Data Architecture & Field OT Mapping",
        description: "Multinational energy company ~ Delivered a technical integration blueprint for an energy-sector multinational, mapping data pipelines across enterprise systems (SAP ERP, SLB Lumi, Avocet) and field OT systems (AVEVA PI, SCADA). Established Model Context Protocol (MCP) data architecture and security boundaries to lay the technical foundation for a later enterprise-wide AI rollout.",
        deployedResult: "Enterprise + field OT systems mapped for an AI rollout",
        stack: ["Enterprise Architecture", "SAP / AVEVA PI", "MCP"],
        github: "",
        pages: [
          { src: "/blueprint-1-architecture.jpg", alt: "Conceptual architecture: a supervisor agent over asset-health, production and finance agents, reading AVEVA PI, SLB Lumi and SAP" },
          { src: "/blueprint-2-objectives.jpg", alt: "Business objectives: eleven objectives from equipment uptime to decision support" },
          { src: "/blueprint-3-ai-agents.jpg", alt: "Workstream 9, AI agents: ten agents from production intelligence to portfolio intelligence" },
          { src: "/blueprint-4-governance.jpg", alt: "AI governance and supervisory control, with four levels of risk-based autonomy" },
          { src: "/blueprint-5-kpis.jpg", alt: "Key business KPIs across production, reliability, maintenance, abnormality, deferment, gas lift, financial and portfolio" },
        ],
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
    markers: ["quadrupling", "neobank", "up to 55%", "security boundaries", "ticket volume by 65%", "60-day churn by 33%", "strict SLAs", "SQL query pipelines", "4 to 35", "8,000 customer", "99% accuracy", "consistently reliable"],
    roles: [
      {
        role: "Founder",
        company: "Rithma Labs (Global AI & Systems Consulting)",
        dates: "Sept 2024 – Present",
        opsLog: "DEPLOYING AGENTIC SYSTEMS GLOBALLY",
        bullets: [
          "Invoice Exception Handler ~ Built for a construction company ~ Plugs into financial and ERP workflows and scans incoming vendor purchase orders against bills using containerized local LLMs. Isolates line-item pricing discrepancies, tax mismatches, and missing delivery receipts. Routes only non-standard exceptions to human managers via a dedicated Slack channel and sends clean invoices straight to payment processing ~ quadrupling invoice processing capacity during peak weeks.",
          "Multi-Tier Support Pipeline ~ Worked directly with the CTO of a high-growth neobank to build automated customer service infrastructure from scratch. Connects the mobile app chat frontend to n8n, Zendesk, and Slack, forming a multi-tier support pipeline. An AI triage layer resolves queries with zero human touch, turns complex issues into context-rich Zendesk tickets, and sends real-time Slack alerts for high-priority operational and security escalations.",
          "LLM Wikipedia ~ Acts as an enterprise knowledge engine for organizational policies, SOPs, and compliance documentation across growing businesses ~ most recently deployed for a full-service law firm to query legal precedents and case files down to clause-level citations. Employs GraphRAG and hybrid vector retrieval to resolve complex multi-hop queries in natural language with strict source attribution, cutting associate legal research time by up to 55%. Features Role-Based Access Control (RBAC) to enforce ethical walls and safeguard attorney-client privilege.",
          "Retention AI Engine ~ Built for an e-commerce brand ~ An automated churn-prediction and re-engagement pipeline triggered by purchase dormancy and contact decay. It uses LLM-written sequences to send targeted WhatsApp and email outreach, cutting 60-day churn by 33% and recovering over ₦17M in dormant customer lifetime value within two months.",
          "Integration Blueprint ~ Multinational energy company ~ Delivered a technical integration blueprint for an energy-sector multinational, mapping data pipelines across enterprise systems (SAP ERP, SLB Lumi, Avocet) and field OT systems (AVEVA PI, SCADA). Established Model Context Protocol (MCP) data architecture and security boundaries to lay the technical foundation for a later enterprise-wide AI rollout.",
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
          "Managed international supply chain logistics across fabric sourcing and garment manufacturing using Slack and Airtable databases, supporting over 8,000 customer transactions across bespoke and retail services.",
          "Designed an automated Google Sheets fulfillment system integrated with GIG & FedEx API webhooks to track inventory and manage local courier deliveries across extensive SKUs with 99% accuracy.",
          "Rolled out standardized operating procedures (SOPs) across customer service and returns ~ deploying a website AI chatbot for routine FAQ deflection, integrated with WhatsApp for human escalation paths and Zendesk for end-to-end ticket logging and resolution tracking to deliver a seamless, customer-obsessed experience.",
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
      { label: "view my résumé →", href: "/ezeh_cv.pdf", primary: true },
    ] satisfies Link[],
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
