import type { Site, Metadata, PersonalLink } from "@types";
import { Book, Github, Linkedin } from "@lucide/astro";

export const SITE: Site = {
  NAME: "giorgiodg.it",
  EMAIL: "",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_SHOWCASE_ITEMS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Giorgio Delle Grottaglie",
  DESCRIPTION:
    "I am Giorgio Delle Grottaglie, and I do Technology stuff. Born and raised in the Heel of Italy, based in Rome.",
};

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION: "More information about me",
};

export const SKILLS: Metadata = {
  TITLE: "Skills",
  DESCRIPTION: "Check out my hard and soft skills",
};

export const CREDITS: Metadata = {
  TITLE: "Credits",
  DESCRIPTION: "",
};

export const CV: Metadata = {
  TITLE: "Cv",
  DESCRIPTION: "",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION:
    "Check out my hard and soft skills, and what people say about me.",
};

export const SHOWCASE: Metadata = {
  TITLE: "Showcase",
  DESCRIPTION:
    "A diverse collection of artifacts like software projects, blogs and talks.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects, with links to repositories and demos.",
};

export const PAGE_404: Metadata = {
  TITLE: "404 Not Found",
  DESCRIPTION: "",
};

export const SKILLS_LIST = {
  "Leadership & Management": [
    "Multi-Cultural Team Leadership",
    "Stakeholder Management",
    "Business Agility",
    "Agile Practices",
    "Process Improvement",
    "Coaching & Mentorship",
  ],
  Development: [
    "JavaScript",
    "NodeJS",
    "ReactJS",
    "Astro",
    "Next.js",
    "TypeScript",
    "PHP",
    "MySQL",
  ],
  "Devops & Cloud": [
    "AWS",
    "CI/CD (Spinnaker, Jenkins)",
    "Kubernetes",
    "Backstage",
    "GitHub",
    "Bash",
    "Go",
    "Python",
  ],
};

export const PERSONAL_LINKS: PersonalLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/giorgiodg/",
    icon: Github,
    trackingEvent: "cta-click",
    trackingProperties: '{"buttonText":"GitHub","source":"index"}',
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/giorgiodellegrottaglie/",
    icon: Linkedin,
    trackingEvent: "cta-click",
    trackingProperties: '{"buttonText":"LinkedIn","source":"index"}',
  },
  {
    name: "Medium",
    href: "https://medium.com/@giorgio.dg",
    icon: Book,
    trackingEvent: "cta-click",
    trackingProperties: '{"buttonText":"LinkedIn","source":"index"}',
  },
];
