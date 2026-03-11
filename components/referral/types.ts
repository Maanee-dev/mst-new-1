
export type ReferralStatus = 'Clicked' | 'Inquired' | 'Booked' | 'Confirmed' | 'Paid';

export type DealStage = 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface ReferralActivity {
  id: string;
  date: string;
  name: string;
  status: ReferralStatus;
  stage?: DealStage;
  value?: number;
  reward?: number;
  email?: string;
  resort?: string;
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
