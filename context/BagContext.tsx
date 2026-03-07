import React, { createContext, useContext, useState, useEffect } from 'react';
import { BagItem, Offer } from '../types';
import { supabase, mapResort, mapOffer } from '../lib/supabase';

import { User } from '@supabase/supabase-js';

interface BagContextType {
  items: BagItem[];
  likedResorts: BagItem[];
  isDiscoveryMode: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  adults: number;
  childrenCount: number;
  addItem: (item: BagItem) => void;
  removeItem: (id: string) => void;
  toggleLike: (item: BagItem) => void;
  isLiked: (id: string) => boolean;
  setDiscoveryMode: (active: boolean) => void;
  clearBag: () => void;
  isInBag: (id: string) => boolean;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setAdults: (count: number) => void;
  setChildrenCount: (count: number) => void;
  totalItems: number;
  isUserPanelOpen: boolean;
  setIsUserPanelOpen: (open: boolean) => void;
  memberStatus: 'Silver' | 'Gold' | 'Platinum';
  memberDiscount: number;
  user: User | null;
  allOffers: Offer[];
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BagItem[]>([]);
  const [likedResorts, setLikedResorts] = useState<BagItem[]>([]);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [memberStatus, setMemberStatus] = useState<'Silver' | 'Gold' | 'Platinum'>('Silver');
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Calculate discount based on status
  const memberDiscount = memberStatus === 'Silver' ? 0.05 : memberStatus === 'Gold' ? 0.10 : 0.15;

  // Listen for auth changes
  useEffect(() => {
    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) setMemberStatus('Silver'); // Mock logic
    });

    // Subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setMemberStatus('Silver');
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch offers on mount
  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await supabase.from('offers').select('*, resorts(slug, name)');
      if (data) {
        setAllOffers(data.map(mapOffer));
      }
    };
    fetchOffers();
  }, []);



  // Load from localStorage on mount
  useEffect(() => {
    const savedBag = localStorage.getItem('serenity_bag');
    const savedLikes = localStorage.getItem('serenity_likes');
    const savedStartDate = localStorage.getItem('serenity_bag_start_date');
    const savedEndDate = localStorage.getItem('serenity_bag_end_date');
    const savedAdults = localStorage.getItem('serenity_bag_adults');
    const savedChildren = localStorage.getItem('serenity_bag_children');
    
    if (savedBag) {
      try {
        setItems(JSON.parse(savedBag));
      } catch (e) {
        console.error('Failed to parse bag from localStorage', e);
      }
    }
    if (savedLikes) {
      try {
        setLikedResorts(JSON.parse(savedLikes));
      } catch (e) {
        console.error('Failed to parse likes from localStorage', e);
      }
    }
    if (savedStartDate) setStartDate(new Date(savedStartDate));
    if (savedEndDate) setEndDate(new Date(savedEndDate));
    if (savedAdults) setAdults(parseInt(savedAdults, 10));
    if (savedChildren) setChildrenCount(parseInt(savedChildren, 10));
    
    // Check user status
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Mock logic for now - could be from user_metadata
        setMemberStatus('Silver'); 
      }
    });
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('serenity_bag', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('serenity_likes', JSON.stringify(likedResorts));
  }, [likedResorts]);

  useEffect(() => {
    if (startDate) localStorage.setItem('serenity_bag_start_date', startDate.toISOString());
    else localStorage.removeItem('serenity_bag_start_date');
  }, [startDate]);

  useEffect(() => {
    if (endDate) localStorage.setItem('serenity_bag_end_date', endDate.toISOString());
    else localStorage.removeItem('serenity_bag_end_date');
  }, [endDate]);

  useEffect(() => {
    localStorage.setItem('serenity_bag_adults', adults.toString());
  }, [adults]);

  useEffect(() => {
    localStorage.setItem('serenity_bag_children', childrenCount.toString());
  }, [childrenCount]);

  const addItem = async (item: BagItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });

    // If adding an offer, also add the associated resort
    if (item.type === 'offer' && item.resortId) {
      try {
        // Check if resort is already in bag (using current state, might miss race conditions but okay for UI)
        // We use a functional update to be safe
        const { data } = await supabase.from('resorts').select('*').eq('id', item.resortId).single();
        
        if (data) {
          const resort = mapResort(data);
          setItems(prev => {
            if (prev.find(i => i.id === resort.id)) return prev;
            return [...prev, {
              id: resort.id,
              type: 'resort', // Cast as BagItemType if needed, but string matches
              name: resort.name,
              image: resort.images[0],
              slug: resort.slug,
              atoll: resort.atoll,
              price: resort.priceRange
            } as BagItem];
          });
        }
      } catch (err) {
        console.error('Error fetching associated resort:', err);
      }
    }
  };

  // Automatically add applicable offers based on dates
  useEffect(() => {
    if (startDate && endDate && allOffers.length > 0) {
      allOffers.forEach(offer => {
        if (offer.startDate && offer.endDate) {
          const offerStart = new Date(offer.startDate);
          const offerEnd = new Date(offer.endDate);
          
          // Check if the stay overlaps with the offer validity
          // Simple logic: if the start date falls within the offer period
          if (startDate >= offerStart && startDate <= offerEnd) {
            // Check if already in bag to avoid duplicates/loops
            if (!items.find(i => i.id === offer.id)) {
              addItem({
                id: offer.id,
                type: 'offer',
                name: offer.title,
                image: offer.image,
                slug: offer.resortSlug,
                price: offer.price,
                details: offer.resortName,
                resortId: offer.resortId
              });
            }
          }
        }
      });
    }
  }, [startDate, endDate, allOffers, items]);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleLike = (item: BagItem) => {
    setLikedResorts(prev => {
      if (prev.find(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isLiked = (id: string) => {
    return likedResorts.some(item => item.id === id);
  };

  const setDiscoveryMode = (active: boolean) => {
    setIsDiscoveryMode(active);
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const clearBag = () => {
    setItems([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setAdults(2);
    setChildrenCount(0);
  };

  const isInBag = (id: string) => {
    return items.some(item => item.id === id);
  };

  const totalItems = items.length;

  return (
    <BagContext.Provider value={{ 
      items, 
      likedResorts,
      isDiscoveryMode,
      startDate, 
      endDate, 
      adults, 
      childrenCount, 
      addItem, 
      removeItem, 
      toggleLike,
      isLiked,
      setDiscoveryMode,
      clearBag, 
      isInBag, 
      setStartDate, 
      setEndDate, 
      setAdults, 
      setChildrenCount, 
      totalItems,
      isUserPanelOpen,
      setIsUserPanelOpen,
      memberStatus,
      memberDiscount,
      user,
      allOffers
    }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};
