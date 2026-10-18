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

export type Topology = "radial" | "tree" | "grid" | "pipeline";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  topology: Topology;
  oneLiner: string;
  deployedAt: string;
  deployedResult: string;
  teaching: string;
  teachingStory: readonly string[];
  stack: readonly string[];
  github: string;
};

export type Role = {
  role: string;
  company: string;
  dates: string;
  opsLog: string;
  bullets: string[];
  // the graph drawn on the role card's cover (see GraphPattern)
  topology: Topology;
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
    body: "I'm not that interested in Agents ~ I'm interested in the processes, the handoffs, the 5-minute decision that stalls for 48 hours. I re-imagine the process, then build the agent in - around it.",
    primary: { label: "view my work →", href: "https://github.com/Ezeh8" } satisfies Link,
    // Downloads straight away. The file lives at public/Ezeh-Ikenna-CV.pdf.
    secondary: { label: "download CV ↓", href: "/Ezeh-Ikenna-CV.pdf" } satisfies Link,
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
        id: "invoice-handler",
        title: "Invoice Exception Handler",
        subtitle: "",
        topology: "tree",
        oneLiner: "An AI agent that catches, routes, and resolves invoice exceptions in QuickBooks ~ turning a multi-step manual review into a single approval decision.",
        deployedAt: "Construction industry client",
        deployedResult: "50 → 200+ invoices processed per week at peak",
        teaching: "Agents break at the seams ~ the handoffs you didn't design are the ones that fail first.",
        teachingStory: [
          "The build worked well until it hit real client data. Vendor names didn't match. POs weren't linked to Bills. Approval gates sat in an inbox for 48 hours.",
          "The agent logic was fine. The process around it wasn't designed for automation. That's where the actual work was.",
          "Every system I've built since starts with a process map, not a tech stack.",
        ],
        stack: ["LangGraph", "FastAPI", "Ollama", "Postgres", "Docker"],
        github: "",
      },
      {
        id: "llm-wiki",
        title: "Large Language Model Wikipedia",
        subtitle: "",
        topology: "radial",
        oneLiner: "A knowledge base that answers staff questions from company SOP and policy documents ~ with a citation behind every answer and no hallucinated sources.",
        deployedAt: "RankedLM (internal)",
        deployedResult: "4 live SOPs · 29 regression tests · weekly drift check · CI/CD gate",
        teaching: "RAG at production scale is a governance problem before it's a retrieval problem.",
        teachingStory: [
          "The retrieval worked from day one. The hard part was what goes in, when it changes, and who manages it.",
          "Two real incidents mid-build: an API key landed in the wrong config field and got printed to the terminal. A live prompt-injection payload sat in the corpus for weeks without anyone noticing.",
          "What shipped is mostly a content pipeline with a query interface attached. That inversion is the thing I keep thinking about.",
        ],
        stack: ["LangGraph", "Qdrant", "FastAPI", "LangSmith", "GitHub Actions"],
        github: "https://github.com/ezeh8/llm_wiki",
      },
      {
        id: "keycard",
        title: "Keycard",
        subtitle: "Agent Access Control Layer",
        topology: "grid",
        oneLiner: "A security layer that governs what agents can access, who they can act as, and when their permissions expire ~ built so no agent operates outside its lane.",
        deployedAt: "RankedLM agent infrastructure",
        deployedResult: "7 security steps live-tested · RBAC + ABAC + server-derived audit trail",
        teaching: "In agentic systems, the access model is the trust model ~ and most builds skip it entirely.",
        teachingStory: [
          "The question that started this: if an agent approves a payment and something goes wrong, who is accountable? What's the trail?",
          "Most agentic builds hand agents a key and trust them. Keycard gates every tool call by scope, derives identity server-side, and fails closed if the audit write itself fails.",
          "Governance isn't a final step you add when the system is done. It's a decision you either make early or spend a lot of time undoing later.",
        ],
        stack: ["FastAPI", "FastMCP", "Postgres", "JWT", "RBAC/ABAC"],
        github: "",
      },
      {
        id: "rankedlm",
        title: "RankedLM",
        subtitle: "Agentic Commerce Infrastructure",
        topology: "pipeline",
        oneLiner: "A multi-skill AI pipeline that evaluates, routes, and ranks decisions across a commerce operation ~ replacing the coordination layer, not just automating individual tasks.",
        deployedAt: "RankedLM + Rithma Labs clients",
        deployedResult: "Logistics, construction, SaaS, and energy engagements",
        teaching: "The bottleneck was never the task ~ it was always the handoff between people deciding what to do next.",
        teachingStory: [
          "Every client had the same pattern. The tasks were fine. The coordination between them wasn't ~ approvals sitting in email, decisions stalled because the right person wasn't reachable.",
          "The pipeline doesn't automate the tasks. It automates the routing between them. That's a different problem and a different design.",
          "The highest-value thing an AI system can do inside a business is compress decision latency, not just task latency. That realization changed how I scope every build.",
        ],
        stack: ["LangGraph", "FastAPI", "Claude", "Qdrant", "LangSmith"],
        github: "",
      },
    ] as const satisfies readonly Project[],
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
        topology: "radial",
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
        topology: "grid",
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
        topology: "tree",
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
    text: "Tell me about your business, the AI you've adopted so far, and your most manual process. I'm based in Nigeria and work remotely across time zones.",
    email: email as string | null,
    buttons: [
      { label: "get in touch →", href: `mailto:${email}`, primary: true },
      { label: "view my work →", href: "https://github.com/Ezeh8", primary: true },
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
