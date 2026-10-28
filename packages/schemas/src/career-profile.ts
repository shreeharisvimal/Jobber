export interface CareerProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  targetRole: string;
  yearsOfExperience: number;
  skills: SkillCategory[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  links: ProfileLink[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface ProfileLink {
  platform: string;
  url: string;
}
