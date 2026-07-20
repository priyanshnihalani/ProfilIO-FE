export type ResumeExperience = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  school: string;
  dates: string;
  details?: string;
};

export type ResumeProject = {
  name: string;
  meta: string;
  bullets: string[];
};

export type ResumeData = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: string[];
  projects: ResumeProject[];
  languages: string[];
  awards: ResumeProject[];
  atsScore: number;
};

export const defaultResumeData: ResumeData = {
  fullName: 'Alexandra Chen',
  headline: 'Senior Product Manager',
  email: 'alexandra.chen@email.com',
  phone: '+1 (415) 555-0182',
  location: 'San Francisco, CA',
  links: ['linkedin.com/in/alexchen', 'github.com/alexchen'],
  summary:
    'Results-driven professional with experience leading cross-functional teams, improving business outcomes, and delivering measurable impact across digital products and operations.',
  skills: [
    'Product Strategy',
    'Agile / Scrum',
    'SQL',
    'User Research',
    'A/B Testing',
    'Figma',
    'Python',
    'JIRA',
    'Analytics',
    'Roadmapping',
  ],
  experience: [
    {
      title: 'Senior Product Manager',
      company: 'Stripe, Inc.',
      location: 'San Francisco, CA',
      dates: 'Jan 2021 - Present',
      bullets: [
        'Led development of billing product improvements that contributed to $28M increase in ARR',
        'Managed cross-functional team of 12 engineers, 3 designers, and 2 data analysts',
        'Reduced customer churn by 18% through targeted feature development and improved onboarding',
      ],
    },
    {
      title: 'Product Manager',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      dates: 'Mar 2018 - Dec 2020',
      bullets: [
        'Owned host dashboard product serving 4M+ active hosts across 220 countries',
        'Shipped 3 major feature releases per quarter, improving host NPS by 22 points',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science, Minor in Business',
      school: 'University of California, Berkeley',
      dates: '2012 - 2016',
      details: 'GPA 3.8',
    },
  ],
  certifications: ['Certified Scrum Product Owner'],
  projects: [
    {
      name: 'Customer Insights Dashboard',
      meta: 'Analytics platform',
      bullets: ['Built executive dashboard that unified product, support, and revenue signals'],
    },
  ],
  languages: ['English - Fluent'],
  awards: [],
  atsScore: 82,
};
