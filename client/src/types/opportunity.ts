export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type OpportunityType = 'Internship' | 'Full-Time Fresher' | 'Junior Associate';
export type ExperienceLevel = 'Students / Freshers' | '0-1 Years' | '1-3 Years';

export interface Opportunity {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
    website: string;
    isVerified: boolean;
    industry: string;
    headquarters: string;
  };
  category:
    | 'Software Engineering'
    | 'AI / Machine Learning'
    | 'Data Science'
    | 'UI/UX Design'
    | 'Product Management'
    | 'Cloud & DevOps'
    | 'Cybersecurity'
    | 'Growth & Marketing';
  roleType: OpportunityType;
  workMode: WorkMode;
  location: string;
  experienceLevel: ExperienceLevel;
  stipend: {
    amount: string;
    numericMonthly: number; // for range filtering
    currency: 'INR' | 'USD';
    hasPPO: boolean;
    ppoRange?: string;
  };
  duration: string;
  batchEligibility: string[];
  degreeEligibility: string[];
  skillsRequired: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  applicationDeadline: string;
  postedDate: string;
  applicantCount: number;
  openings: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isMockData: boolean; // false for verified external provider listings, true for demo seed data
  sourceName?: 'RemoteOK' | 'Adzuna' | 'Internal';
  sourceUrl?: string;
  applyUrl?: string;
  lastVerifiedAt?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  university: string;
  degree: string;
  graduationYear: string;
  currentCity: string;
  bio: string;
  skills: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  workModePreference: WorkMode | 'Flexible';
  preferredRoles: string[];
  expectedStipendMin: number;
  resumeFileName?: string;
  profileCompletionPercentage: number;
}

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  companyLogoUrl: string;
  location: string;
  workMode: WorkMode;
  stipendAmount: string;
  appliedDate: string;
  status: 'Applied' | 'In Review' | 'Shortlisted' | 'Assessment' | 'Interview Scheduled';
  coverNote?: string;
}

export interface OpportunityFilterOptions {
  search?: string;
  category?: string;
  roleType?: string;
  workMode?: string;
  experienceLevel?: string;
  location?: string;
  minStipend?: number;
  hasPPOOnly?: boolean;
  source?: 'all' | 'live' | 'demo';
  sortBy?: 'recommended' | 'stipend_high' | 'deadline_soon' | 'newest';
}
