
import React from 'react';
import { ReferralActivity, ReferralStatus } from './types';
import { motion } from 'motion/react';

interface ActivityFeedProps {
  activities: ReferralActivity[];
}

const StatusBadge: React.FC<{ status: ReferralStatus }> = ({ status }) => {
  const styles = {
    Clicked: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500/20',
    Inquired: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-500/20',
    Booked: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/20',
    Confirmed: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-500/20',
    Paid: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
        <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">No activity yet - start sharing!</p>
        <button className="text-sky-500 font-bold text-xs uppercase tracking-widest hover:text-sky-600 transition-colors">
          Get Sharing Tips
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
      <div className="p-6 border-b border-slate-50 dark:border-white/5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Activity</h3>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-white/5">
        {activities.map((activity, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={activity.id} 
            className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                {activity.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{new Date(activity.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {activity.value && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">${activity.value.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Booking Value</p>
                </div>
              )}
              <StatusBadge status={activity.status} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
