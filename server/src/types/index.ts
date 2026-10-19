export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  avatar_url?: string | null;
  bio?: string | null;
  role: 'candidate' | 'employer' | 'admin' | 'reader' | 'creator';
  created_at: string;
  updated_at: string;
}

export interface Manga {
  id: number;
  title: string;
  japanese_title?: string | null;
  slug: string;
  synopsis: string;
  cover_image: string;
  banner_image?: string | null;
  author: string;
  artist: string;
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  demographic: 'Shonen' | 'Seinen' | 'Shojo' | 'Josei';
  release_year: number;
  genres: string[]; // parsed from JSON
  rating_avg: number;
  rating_count: number;
  views_count: number;
  bookmarks_count: number;
  creator_id?: number | null;
  is_featured: number;
  created_at: string;
  updated_at: string;
  chapters_count?: number;
  latest_chapter?: number;
}

export interface ChapterPage {
  pageNumber: number;
  imageUrl: string;
  caption?: string;
}

export interface Chapter {
  id: number;
  manga_id: number;
  chapter_number: number;
  title: string;
  release_date: string;
  views_count: number;
  pages: ChapterPage[]; // parsed from JSON
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  manga_id: number;
  status: 'reading' | 'plan_to_read' | 'completed' | 'dropped';
  last_read_chapter_id?: number | null;
  last_read_page: number;
  created_at: string;
  updated_at: string;
  manga?: Manga;
  last_read_chapter?: Chapter;
}

export interface Review {
  id: number;
  user_id: number;
  manga_id: number;
  rating_story: number;
  rating_art: number;
  rating_characters: number;
  rating_overall: number;
  title: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    avatar_url?: string | null;
    role: string;
  };
}

export interface ChapterComment {
  id: number;
  chapter_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: {
    id: number;
    username: string;
    avatar_url?: string | null;
  };
}

export interface AuthTokenPayload {
  userId: number;
  username: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin' | 'reader' | 'creator';
}

export interface CandidateProfile {
  id: number;
  user_id: number;
  full_name: string;
  headline?: string | null;
  bio?: string | null;
  phone?: string | null;
  current_location: string;
  preferred_locations: string[]; // parsed from JSON
  work_modes: Array<'Remote' | 'Hybrid' | 'Onsite'>; // parsed from JSON
  experience_level: string;
  current_institution?: string | null;
  graduation_year: number;
  degree: string;
  field_of_study: string;
  cgpa: number;
  skills: string[]; // parsed from JSON
  portfolio_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  resume_filename?: string | null;
  resume_path?: string | null;
  preferred_roles: string[]; // parsed from JSON
  min_stipend_expected: number;
  availability_months: number;
  readiness_score: number;
  created_at: string;
  updated_at: string;
}

export interface Internship {
  id: number;
  title: string;
  slug: string;
  company_name: string;
  company_logo: string;
  company_website?: string | null;
  is_verified: boolean;
  category: string;
  role_type: 'Internship' | 'Fresher / Full-time';
  work_mode: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  stipend_min: number;
  stipend_max: number;
  stipend_period: string;
  ppo_offered: boolean;
  ppo_ctc_min?: number | null;
  ppo_ctc_max?: number | null;
  duration_months: number;
  experience_level: string;
  description: string;
  responsibilities: string[]; // parsed from JSON
  requirements: string[]; // parsed from JSON
  preferred_qualifications: string[]; // parsed from JSON
  perks: string[]; // parsed from JSON
  eligible_batches: number[]; // parsed from JSON
  eligible_degrees: string[]; // parsed from JSON
  min_cgpa: number;
  is_mock_data: boolean;
  is_active: boolean;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface SavedInternship {
  id: number;
  user_id: number;
  internship_id: number;
  created_at: string;
  internship?: Internship;
}

export interface ApplicationRecord {
  id: number;
  user_id: number;
  internship_id: number;
  status: 'interested' | 'applied' | 'in_review' | 'interview' | 'rejected' | 'offer';
  cover_note?: string | null;
  resume_used?: string | null;
  match_score: number;
  match_reasons?: MatchResult | null;
  applied_at: string;
  updated_at: string;
  internship?: Internship;
}

export interface MatchBreakdown {
  skillsScore: number;       // max 40
  eligibilityScore: number;  // max 25
  preferenceScore: number;   // max 20
  workModeScore: number;     // max 15
}

export interface MatchResult {
  score: number; // 0 to 100
  verdict: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Low Match';
  matchedSkills: string[];
  missingSkills: string[];
  eligibilityIssues: string[];
  highlights: string[];
  breakdown: MatchBreakdown;
}
