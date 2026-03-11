
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  MousePointer2, 
  UserPlus, 
  CheckCircle2, 
  Wallet,
  ChevronDown,
  Bell
} from 'lucide-react';
import StatsCard from './StatsCard';
import ActivityFeed from './ActivityFeed';
import EarningsChart from './EarningsChart';
import ReferralLink from './ReferralLink';
import AdminPanel from './AdminPanel';
import { MOCK_STATS, MOCK_ACTIVITIES, MOCK_CHART_DATA, simulateApiCall } from './mockData';
import { ReferrerStats, ReferralActivity, MonthlyEarnings } from './types';

import { supabase } from '../../lib/supabase';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [partner, setPartner] = useState<any>(null);
  const [activities, setActivities] = useState<ReferralActivity[]>([]);
  const [chartData, setChartData] = useState<MonthlyEarnings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // 1. Fetch Partner Profile
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (partnerError) {
        console.error('Error fetching partner:', partnerError);
      } else {
        setPartner(partnerData);
      }

      // 2. Fetch Inquiries (Activities)
      if (partnerData) {
        const { data: inquiryData, error: inquiryError } = await supabase
          .from('referral_inquiries')
          .select('*')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false });

        if (inquiryError) {
          console.error('Error fetching inquiries:', inquiryError);
        } else {
          // Map DB fields to component types
          const mappedActivities: ReferralActivity[] = (inquiryData || []).map(item => ({
            id: item.id,
            date: item.created_at,
            name: item.name,
            status: item.status as ReferralStatus,
            stage: item.stage as DealStage,
            value: item.value,
            reward: item.reward,
            email: item.email,
            resort: item.resort
          }));
          setActivities(mappedActivities);
        }
      }

      // 3. Mock Chart Data (since we don't have historical aggregation yet)
      setChartData(MOCK_CHART_DATA);
      
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
          <div className="lg:col-span-4 h-96 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const stats: ReferrerStats = {
    totalClicks: partner?.total_clicks || 0,
    totalLeads: partner?.total_leads || 0,
    confirmedBookings: partner?.confirmed_bookings || 0,
    totalEarnings: partner?.total_earnings || 0,
    availableEarnings: partner?.available_earnings || 0,
    trends: { clicks: 0, leads: 0, bookings: 0, earnings: 0 }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-slate-950 transition-colors duration-700">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'Admin' ? (
          <AdminPanel />
        ) : (
          <div className="space-y-12">
            {/* Hero Section */}
            <ReferralLink 
              link={`${window.location.origin}/inquiry/${partner?.referral_code}`} 
              code={partner?.referral_code || '...'} 
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Clicks" 
                value={stats?.totalClicks.toLocaleString() || 0} 
                trend={stats?.trends.clicks}
                icon={<MousePointer2 size={20} />} 
              />
              <StatsCard 
                title="Total Leads" 
                value={stats?.totalLeads || 0} 
                icon={<UserPlus size={20} />} 
              />
              <StatsCard 
                title="Confirmed Bookings" 
                value={stats?.confirmedBookings || 0} 
                icon={<CheckCircle2 size={20} />} 
              />
              <StatsCard 
                title="Total Earnings" 
                value={`$${stats?.totalEarnings.toLocaleString() || 0}`} 
                subtext={`Available: $${stats?.availableEarnings}`}
                icon={<Wallet size={20} />} 
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Chart & Table */}
              <div className="lg:col-span-8 space-y-8">
                <EarningsChart data={chartData} />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Earnings Breakdown</h3>
                    <div className="flex gap-4">
                      <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referral</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {activities.filter(a => a.reward).map((activity) => (
                          <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-8 py-6 text-xs font-bold text-slate-900 dark:text-white">{new Date(activity.date).toLocaleDateString()}</td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-900 dark:text-white">{activity.name}</td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-900 dark:text-white">${activity.value?.toLocaleString()}</td>
                            <td className="px-8 py-6 text-xs font-black text-sky-600 dark:text-sky-400">${activity.reward}</td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                activity.status === 'Paid' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-500/20' :
                                'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-500/20'
                              }`}>
                                {activity.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payout Method</p>
                        <div className="flex items-center gap-2">
                          <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" className="h-4 rounded" alt="PayPal" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">sarah.j@example.com</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Threshold</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">$150 / $100</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto bg-sky-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20">
                      Request Payout
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Feed & Tips */}
              <div className="lg:col-span-4 space-y-8">
                <ActivityFeed activities={activities} />
                
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  <div className="relative z-10">
                    <h4 className="text-xl font-serif font-medium mb-4">Partner Bonus</h4>
                    <p className="text-xs text-white/80 leading-relaxed mb-8">Choose "Resort Credit" as your payout method and receive an extra 10% bonus on your earnings!</p>
                    <button className="w-full bg-white text-orange-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-50 transition-all">
                      Switch to Resort Credit
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Partner Resources</h4>
                  <div className="space-y-4">
                    {[
                      'Media Kit & Brand Assets',
                      'High-Res Resort Photos',
                      'Sharing Best Practices',
                      'Program Terms & Conditions'
                    ].map((item, i) => (
                      <button key={i} className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 flex justify-between items-center">
                        {item} <ArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper components for the dashboard
const ArrowRight: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default Dashboard;
