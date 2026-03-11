
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtext, trend, icon }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl text-sky-600 dark:text-sky-400">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        {subtext && <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-2 font-medium">{subtext}</p>}
      </div>
    </motion.div>
  );
};

export default StatsCard;
