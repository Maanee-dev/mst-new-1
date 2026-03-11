
export type ReferralStatus = 'Clicked' | 'Inquired' | 'Booked' | 'Confirmed' | 'Paid';

export interface ReferralActivity {
  id: string;
  date: string;
  name: string;
  status: ReferralStatus;
  value?: number;
  reward?: number;
}

export interface ReferrerStats {
  totalClicks: number;
  totalLeads: number;
  confirmedBookings: number;
  totalEarnings: number;
  availableEarnings: number;
  trends: {
    clicks: number;
  };
}

export interface MonthlyEarnings {
  month: string;
  amount: number;
}

export interface Referrer {
  id: string;
  name: string;
  email: string;
  code: string;
  referrals: number;
  earnings: number;
  status: 'Active' | 'Pending' | 'Suspended';
  avatar?: string;
}
