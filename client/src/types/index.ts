export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
  role: 'candidate' | 'employer' | 'reader' | 'creator' | 'admin';
  created_at: string;
  candidateProfile?: any;
  stats?: {
    bookmarksCount: number;
    chaptersReadCount: number;
    reviewsCount: number;
  };
}

export interface ChapterPage {
  pageNumber: number;
  imageUrl: string;
  caption?: string;
}

export interface Chapter {
  id: number;
  manga_id: number;
  manga_title?: string;
  manga_slug?: string;
  manga_cover?: string;
  chapter_number: number;
  title: string;
  release_date: string;
  views_count: number;
  pages?: ChapterPage[];
  prevChapter?: { id: number; chapter_number: number; title: string } | null;
  nextChapter?: { id: number; chapter_number: number; title: string } | null;
  created_at?: string;
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
  genres: string[];
  rating_avg: number;
  rating_count: number;
  views_count: number;
  bookmarks_count: number;
  creator_id?: number | null;
  is_featured: number;
  chapters_count?: number;
  latest_chapter?: number;
  chapters?: Chapter[];
  userBookmark?: {
    id: number;
    status: 'reading' | 'plan_to_read' | 'completed' | 'dropped';
    last_read_chapter_id?: number | null;
    last_read_page: number;
  } | null;
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
  manga: {
    id: number;
    title: string;
    japanese_title?: string | null;
    slug: string;
    cover_image: string;
    status: string;
    rating_avg: number;
    latest_chapter?: number;
  };
  last_read_chapter?: {
    id: number;
    chapter_number: number;
    title: string;
  } | null;
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
  user: {
    id: number;
    username: string;
    avatar_url?: string | null;
    role: string;
  };
}

export interface ChapterComment {
  id: number;
  chapter_id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    avatar_url?: string | null;
    role: string;
  };
}
