
import React, { useState } from 'react';
import { MOCK_REFERRERS } from './mockData';
import { Referrer } from './types';
import { Search, Filter, Download, Check, X, AlertTriangle, MoreVertical } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [referrers] = useState<Referrer[]>(MOCK_REFERRERS);
  const [search, setSearch] = useState('');

  const filteredReferrers = referrers.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Fraud Alerts */}
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-500/20 p-6 rounded-3xl flex items-start gap-4">
        <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300 uppercase tracking-widest mb-1">Fraud Detection Alert</h4>
          <p className="text-xs text-rose-800/70 dark:text-rose-400/70 leading-relaxed">3 self-referrals detected from IP 192.168.1.45 associated with code "SARAH-J-2024". Review required.</p>
          <div className="mt-4 flex gap-4">
            <button className="text-[10px] font-black text-rose-900 dark:text-rose-300 uppercase tracking-widest underline">Review Activity</button>
            <button className="text-[10px] font-black text-rose-900 dark:text-rose-300 uppercase tracking-widest underline">Dismiss</button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-serif font-medium text-slate-900 dark:text-white tracking-tight">Referral Partners</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Manage and approve your referral network.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search partners..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
            <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"><Filter size={18} /></button>
            <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"><Download size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referrals</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredReferrers.map((referrer) => (
                <tr key={referrer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={referrer.avatar} alt={referrer.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{referrer.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{referrer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">{referrer.code}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{referrer.referrals}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${referrer.earnings.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      referrer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/20' :
                      referrer.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-500/20' :
                      'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                      {referrer.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {referrer.status === 'Pending' && (
                        <>
                          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"><Check size={16} /></button>
                          <button className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"><X size={16} /></button>
                        </>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
