export type Page = 'home' | 'notice' | 'gallery' | 'login' | 'admin';

export interface Notice {
  id: number;
  title: string;
  publishDateTime: string; // Storing as YYYY-MM-DDTHH:MM for easier sorting
  content: string;
  author: string;
  isUrgent?: boolean;
  pdfUrl?: string;
  expiryDate?: string; // YYYY-MM-DD
}

export interface Photo {
  id: number;
  url: string;
  caption: string;
}