
import { ReferralActivity, ReferrerStats, MonthlyEarnings, Referrer } from './types';

export const MOCK_STATS: ReferrerStats = {
  totalClicks: 1240,
  totalLeads: 45,
  confirmedBookings: 12,
  totalEarnings: 600,
  availableEarnings: 150,
  trends: {
    clicks: 12
  }
};

export const MOCK_ACTIVITIES: ReferralActivity[] = [
  { id: '1', date: '2024-03-10', name: 'James Wilson', status: 'Confirmed', value: 4500, reward: 50 },
  { id: '2', date: '2024-03-09', name: 'Sarah Chen', status: 'Booked', value: 3200, reward: 50 },
  { id: '3', date: '2024-03-08', name: 'Michael Brown', status: 'Inquired' },
  { id: '4', date: '2024-03-07', name: 'Anonymous', status: 'Clicked' },
  { id: '5', date: '2024-03-05', name: 'Emma Davis', status: 'Paid', value: 8900, reward: 50 },
  { id: '6', date: '2024-03-01', name: 'Robert Miller', status: 'Confirmed', value: 12000, reward: 50 },
  { id: '7', date: '2024-02-28', name: 'Linda Taylor', status: 'Paid', value: 5600, reward: 50 },
  { id: '8', date: '2024-02-25', name: 'David Garcia', status: 'Inquired' },
];

export const MOCK_CHART_DATA: MonthlyEarnings[] = [
  { month: 'Oct', amount: 100 },
  { month: 'Nov', amount: 150 },
  { month: 'Dec', amount: 250 },
  { month: 'Jan', amount: 200 },
  { month: 'Feb', amount: 350 },
  { month: 'Mar', amount: 150 },
];

export const MOCK_REFERRERS: Referrer[] = [
  { id: 'ref1', name: 'Sarah Johnson', email: 'sarah.j@example.com', code: 'SARAH-J-2024', referrals: 24, earnings: 1200, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'ref2', name: 'Ahmed Hassan', email: 'ahmed.h@example.com', code: 'AHMED-MAL-24', referrals: 15, earnings: 750, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=ahmed' },
  { id: 'ref3', name: 'Elena Rossi', email: 'elena.r@example.com', code: 'ELENA-LUX', referrals: 8, earnings: 400, status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: 'ref4', name: 'Tom Baker', email: 'tom.b@example.com', code: 'TOM-B-REF', referrals: 32, earnings: 1600, status: 'Active', avatar: 'https://i.pravatar.cc/150?u=tom' },
  { id: 'ref5', name: 'Yuki Tanaka', email: 'yuki.t@example.com', code: 'YUKI-TRAVEL', referrals: 5, earnings: 250, status: 'Suspended', avatar: 'https://i.pravatar.cc/150?u=yuki' },
];

export const simulateApiCall = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};
