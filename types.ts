
export enum AccommodationType {
  RESORT = 'RESORT',
  GUEST_HOUSE = 'GUEST_HOUSE',
  LIVEABOARD = 'LIVEABOARD'
}

export enum TransferType {
  SEAPLANE = 'SEAPLANE',
  SPEEDBOAT = 'SPEEDBOAT',
  DOMESTIC_FLIGHT = 'DOMESTIC_FLIGHT'
}

export enum MealPlan {
  ALL_INCLUSIVE = 'ALL_INCLUSIVE',
  FULL_BOARD = 'FULL_BOARD',
  HALF_BOARD = 'HALF_BOARD',
  BED_BREAKFAST = 'BED_BREAKFAST'
}

export interface RoomType {
  name: string;
  description: string;
  highlights: string[];
  image: string;
  size?: string;
  capacity?: string;
}

export interface DiningVenue {
  name: string;
  cuisine: string;
  description: string;
  highlights: string[];
  image: string;
  vibe: string;
}

export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  type: AccommodationType;
  atoll: string;
  priceRange: string;
  rating: number;
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  transfers: TransferType[];
  mealPlans: MealPlan[];
  uvp: string;
  isFeatured?: boolean;
  roomTypes?: RoomType[];
  diningVenues?: DiningVenue[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface Offer {
  id: string;
  resortId: string;
  resortSlug: string;
  resortName: string;
  title: string;
  description: string;
  discount: string;
  startDate?: string;
  endDate?: string;
  expiryDate: string;
  image: string;
  category: 'Early Bird' | 'Last Minute' | 'Honeymoon';
  // Enhanced UI fields
  nights: number;
  roomCategory: string;
  price: number;
  priceSubtext: string;
  rating: number;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: 'Water Sports' | 'Relaxation' | 'Adventure' | 'Wellness' | 'Culture' | 'Culinary';
  atoll?: string;
  resortId?: string;
  resortName?: string;
  resortSlug?: string;
  packages?: {
    name: string;
    price: string;
    features: string[];
  }[];
}

export type BagItemType = 'resort' | 'experience' | 'offer' | 'guest_house' | 'liveaboard';

export interface BagItem {
  id: string;
  type: BagItemType;
  name: string;
  image: string;
  atoll?: string;
  slug?: string;
  price?: number | string;
  details?: string;
}

export type StoryCategory = 'Dispatch' | 'Guide' | 'Update' | 'Tip';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: StoryCategory;
  is_featured?: boolean;
}

export interface ResortComment {
  id: string;
  resort_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  parent_id?: string;
  created_at: string;
  likes_count?: number;
  is_liked?: boolean;
  replies?: ResortComment[];
}
