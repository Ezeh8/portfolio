// All site copy lives here. Edit text in this file only; components read from it.

export type Link = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  readout: string;
  href: string;
};

export type Role = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
};

export const site = {
  name: "Ezeh Ikenna",

  nav: {
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Contact", href: "#contact" },
    ] satisfies Link[],
    cta: { label: "Get in touch", href: "#contact" } satisfies Link,
  },

  hero: {
    label: "AI Product Manager | AI Operations Lead",
    name: "Ezeh Ikenna",
    tagline: "Founder, Rithma Labs",
    headline:
      "I turn messy business operations into agentic systems that run on their own and report back clearly.",
    buttons: [
      { label: "View my work", href: "#work" },
      { label: "Get in touch", href: "#contact" },
    ] satisfies Link[],
  },

  about: {
    label: "01 / About",
    paragraphs: [
      "I spent 10+ years in operations, running teams and suppliers, and learned that companies lose time, money, and trust to broken processes. That lens led me to found Rithma Labs, where I've spent two years delivering production AI for clients across logistics, construction, and finance, from process redesign through deployment and ongoing management.",
      "I build agents that work alongside people and change what a team can handle, from the time it gets back to the capacity it gains and the revenue it protects. Every one is evaluated and traced, so each decision can be seen, questioned, and fixed, and security and governance come standard in everything I ship.",
    ],
  },

  work: {
    label: "02 / Work",
    linkLabel: "View on GitHub",
    projects: [
      {
        id: "scan-llm-wiki",
        name: "LLM Wiki",
        description:
          "A knowledge base that answers staff questions from company policy, with a citation behind every answer.",
        readout: "36 automated tests passing in CI",
        href: "https://github.com/Ezeh8/llm_wiki",
      },
      {
        id: "scan-tool-access",
        name: "Tool Access Controller",
        description:
          "A security layer that controls which tools an AI agent may call, with instant revocation and a full audit trail.",
        readout: "5 agent tools gated / live token revocation",
        href: "#", // TODO: add GitHub URL for Tool Access Controller
      },
      {
        id: "scan-invoice",
        name: "Invoice Exception Handler",
        description:
          "An agent that checks vendor invoices against purchase orders and flags price gaps, duplicates, and missing POs.",
        readout: "peak-week capacity 50 → 200+ invoices",
        href: "#", // TODO: add GitHub URL for Invoice Exception Handler
      },
      {
        id: "scan-command-centre",
        name: "Command Centre",
        description:
          "A scheduled agent that researches, verifies, and republishes a daily briefing to one stable page, with no one watching.",
        readout: "runs unattended every morning / one stable URL",
        href: "#", // TODO: add GitHub URL for Command Centre
      },
    ] satisfies Project[],
  },

  experience: {
    label: "03 / Experience",
    roles: [
      {
        role: "Founder",
        company: "Rithma Labs",
        dates: "Sept 2024 – Present",
        bullets: [
          "Cut admin overhead by 85% for a logistics firm with an n8n pipeline that routes CRM and deal data to billing and project tools, with a guardrail step for edge cases.",
          "Deployed the Invoice Exception Handler for a construction firm, raising invoice processing capacity during peak weeks.",
          "Won back ₦17M+ in revenue in two months for a Nigerian SaaS company with a prompt-engineered churn-reduction system.",
          "Delivered an integration blueprint for an energy multinational across SAP ERP, SLB Lumi, Avocet, AVEVA PI, and SCADA.",
        ],
      },
      {
        role: "Operations Systems Partner",
        company: "Standard Chartered Bank",
        dates: "Aug 2021 – Dec 2024",
        bullets: [
          "Monitored in-app automation for real-time customer engagement and support.",
          "Rolled out a digital KYC verification platform aligned with Central Bank of Nigeria requirements.",
          "Operationalised an AI-driven credit-scoring model with the data science team.",
        ],
      },
      {
        role: "Co-Founder & COO",
        company: "Ropa Brand",
        dates: "Feb 2014 – Mar 2021",
        bullets: [
          "Scaled the team from 4 to 35 people.",
          "Served 1,000+ bespoke and 7,000+ retail customers.",
          "Managed international vendor relationships across sourcing, manufacturing, and packaging.",
        ],
      },
    ] satisfies Role[],
  },

  quote: {
    text: "Countries that own their intelligence layer will write the rules of the 4th Industrial Revolution.",
  },

  contact: {
    label: "04 / Contact",
    headline: "Say hello",
    text: "Based in Nigeria, working remotely across time zones. My inbox is open to anyone building where AI meets operations ~ say hello.",
    buttons: [
      { label: "Email", href: "#" }, // TODO: add email address (mailto:)
      { label: "LinkedIn", href: "#" }, // TODO: add LinkedIn profile URL
      { label: "GitHub", href: "https://github.com/Ezeh8" },
    ] satisfies Link[],
  },

  footer: {
    education: {
      label: "Education",
      items: ["B.Sc. Business Administration, University of Lagos"],
    },
    certificates: {
      label: "Certificates",
      items: [
        "Introduction to Model Context Protocol (Anthropic)",
        "Introduction to Agent Skills (Anthropic)",
        "Deploy Multi-Agent Systems with Gemini Enterprise Agent Platform (Google)",
      ],
    },
    tools: {
      label: "Tools",
      items: [
        "Claude Code",
        "Codex",
        "MCP",
        "LangSmith",
        "Langfuse",
        "n8n",
        "Zapier",
        "GoHighLevel",
      ],
    },
    line: "Agents and blockchain are the twin rails of the next economy; I've been in Nigeria's crypto community for 4+ years, watching them converge.",
    copyright: "© 2026 Ezeh Ikenna",
  },
};
