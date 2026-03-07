
import { createClient } from '@supabase/supabase-js';
import { Accommodation, AccommodationType, TransferType, MealPlan, Offer } from '../types';

const SUPABASE_URL = 'https://zocncwchaakjtsvlscmd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ot34P55l4JGe2RjZywLovA_UokWsJ0I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * HELPER: Robust mapping from Supabase Row to Accommodation Interface
 */
export const mapResort = (item: any, fallback?: Accommodation): Accommodation => {
  const dbImages = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const localImages = fallback?.images || [];
  const finalImages = (dbImages.length > 0 ? dbImages : (localImages.length > 0 ? localImages : ['https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'])).slice(0, 8);

  const dbFeatures = Array.isArray(item.features) ? item.features : [];
  const localFeatures = fallback?.features || [];
  const finalFeatures = dbFeatures.length > localFeatures.length ? dbFeatures : (localFeatures.length > 0 ? localFeatures : dbFeatures);

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    type: (item.type || fallback?.type || 'RESORT') as AccommodationType,
    atoll: item.atoll || fallback?.atoll || 'Unknown Atoll',
    priceRange: item.price_range || fallback?.priceRange || '$$$$',
    rating: item.rating || fallback?.rating || 5,
    description: item.description || fallback?.description || '',
    shortDescription: item.short_description || fallback?.shortDescription || '',
    images: finalImages,
    features: finalFeatures,
    transfers: (Array.isArray(item.transfers) ? item.transfers : (fallback?.transfers || [])) as TransferType[],
    mealPlans: (Array.isArray(item.meal_plans) ? item.meal_plans : (fallback?.mealPlans || [])) as MealPlan[],
    uvp: item.uvp || fallback?.uvp || 'Defined by perspective.',
    isFeatured: !!item.is_featured,
    roomTypes: Array.isArray(item.room_types) ? item.room_types : (fallback?.roomTypes || []),
    diningVenues: Array.isArray(item.dining_venues) ? item.dining_venues : (fallback?.diningVenues || []),
    seoTitle: item.seo_title || fallback?.seoTitle,
    seoDescription: item.seo_description || fallback?.seoDescription,
    seoKeywords: Array.isArray(item.seo_keywords) ? item.seo_keywords : (fallback?.seoKeywords || [])
  };
};

/**
 * HELPER: Robust mapping from Supabase Row to Offer Interface
 */
export const mapOffer = (o: any): Offer => {
  // If the query included a join with resorts, extract the slug
  const resortSlug = o.resorts?.slug || o.resort_slug || 'unknown';
  const resortName = o.resorts?.name || o.resort_name || 'Unknown Resort';
  
  return {
    id: o.id,
    resortId: o.resort_id,
    resortSlug: resortSlug,
    resortName: resortName,
    title: o.title,
    description: o.description || '',
    discount: o.discount,
    startDate: o.start_date,
    endDate: o.end_date,
    expiryDate: o.expiry_date,
    image: o.image,
    category: o.category,
    nights: o.nights || 7,
    roomCategory: o.room_category || 'Luxury Villa',
    price: o.price || 5000,
    priceSubtext: o.price_subtext || 'for 2 adults',
    rating: o.rating || 5
  };
};
