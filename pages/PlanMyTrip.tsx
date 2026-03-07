
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase, mapResort } from '../lib/supabase';
import { Accommodation } from '../types';
import SEO from '../components/SEO';

const STORAGE_KEY = 'serenity_planning_draft';

const PlanMyTrip: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbResorts, setDbResorts] = useState<Accommodation[]>([]);
  
  // Selection States
  const [purpose, setPurpose] = useState('');
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    islandSize: '',
    priceLevel: '',
    villaType: '',
    pool: ''
  });
  const [resortSearch, setResortSearch] = useState('');
  const [selectedResorts, setSelectedResorts] = useState<string[]>([]);
  const [finalDetails, setFinalDetails] = useState({
    fullName: '',
    phoneCode: '+44',
    phone: '',
    email: '',
    dates: '',
    guests: '2',
    mealPlan: 'ALL INCLUSIVE',
    budget: '',
    budgetType: 'Total'
  });

  useEffect(() => {
    const fetchResorts = async () => {
      const { data, error } = await supabase
        .from('resorts')
        .select('*')
        .order('name', { ascending: true });
      
      if (data) {
        setDbResorts(data.map(mapResort));
      }
    };
    fetchResorts();

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.step) setStep(parsed.step);
        if (parsed.purpose) setPurpose(parsed.purpose);
        if (parsed.selectedExperiences) setSelectedExperiences(parsed.selectedExperiences || []);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.selectedResorts) setSelectedResorts(parsed.selectedResorts || []);
        if (parsed.finalDetails) setFinalDetails(parsed.finalDetails);
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      step,
      purpose,
      selectedExperiences,
      preferences,
      selectedResorts,
      finalDetails
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [step, purpose, selectedExperiences, preferences, selectedResorts, finalDetails]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleExperience = (exp: string) => {
    if (selectedExperiences.includes(exp)) {
      setSelectedExperiences(prev => prev.filter(e => e !== exp));
    } else if (selectedExperiences.length < 3) {
      setSelectedExperiences(prev => [...prev, exp]);
    }
  };

  const filteredResortList = useMemo(() => {
    if (!resortSearch || resortSearch.length < 2) return [];
    return dbResorts.filter(r => 
      r.name.toLowerCase().includes(resortSearch.toLowerCase()) && 
      !selectedResorts.includes(r.name)
    ).slice(0, 5);
  }, [resortSearch, selectedResorts, dbResorts]);

  const selectResort = (name: string) => {
    if (selectedResorts.length < 3) {
      setSelectedResorts(prev => [...prev, name]);
      setResortSearch('');
    }
  };

  const removeResort = (name: string) => {
    setSelectedResorts(prev => prev.filter(r => r !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('inquiries').insert({
        inquiry_type: 'general_plan',
        customer_name: finalDetails.fullName,
        customer_email: finalDetails.email,
        customer_phone: `${finalDetails.phoneCode} ${finalDetails.phone}`,
        purpose: purpose,
        experiences: selectedExperiences,
        preferences: preferences,
        preferred_resorts: selectedResorts,
        travel_dates_text: finalDetails.dates,
        guests: parseInt(finalDetails.guests),
        meal_plan: finalDetails.mealPlan,
        budget: finalDetails.budget,
        budget_type: finalDetails.budgetType
      });

      if (error) throw error;

      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Submission error:", err);
      alert("We encountered an error processing your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-parchment dark:bg-slate-950 transition-colors duration-700">
        <div className="text-center max-w-2xl reveal active">
           <span className="text-[10px] font-bold uppercase tracking-[1em] text-sky-500 mb-12 block">{t('plan.successBadge')}</span>
           <h2 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 dark:text-white mb-12 leading-none transition-colors">{t('plan.successTitle')}</h2>
           <div className="h-px w-24 bg-amber-400 mx-auto mb-16"></div>
           <p className="text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] text-[10px] leading-[2.5] mb-16 font-medium max-w-md mx-auto transition-colors">
             {t('plan.successDesc')}
           </p>
           <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.8em] text-slate-950 dark:text-white border-b border-slate-950 dark:border-white pb-3 hover:text-sky-500 hover:border-sky-500 transition-all duration-700">{t('plan.returnHome')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-parchment dark:bg-slate-950 min-h-screen pt-40 pb-32 px-6 transition-colors duration-700">
      <SEO 
        title={t('seo.planTitle', 'Bespoke Holiday Planning | Custom Maldives Itineraries')} 
        description={t('seo.planDesc', 'Initiate your bespoke planning journey. Our specialists curate custom Maldivian portfolios, handling seaplane transfers, resort selections, and private island itineraries tailored to your vision.')}
        keywords={[
          'custom Maldives trip', 'bespoke holiday planning', 'Maldives travel specialist', 
          'tailor made Maldives', 'honeymoon planning Maldives', 'Maldives luxury concierge', 
          'personalized travel itineraries', 'Serenity Maldives planning'
        ]}
        image="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200"
      />
      
      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em] block mb-4 transition-colors">{t('plan.badge')}</span>
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <React.Fragment key={i}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step === i ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xl scale-110' : step > i ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}>{i}</div>
                {i < 5 && <div className="w-4 h-px bg-slate-200 dark:bg-white/5"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-8 md:p-20 shadow-2xl border border-slate-100 dark:border-white/5 min-h-[700px] flex flex-col justify-center transition-colors duration-700">
          
          {/* STEP 1: PURPOSE */}
          {step === 1 && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold mx-auto mb-8 text-sm transition-colors">1</div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight transition-colors">{t('plan.q1')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { label: t('plan.purposes.honeymoon'), key: 'A' },
                  { label: t('plan.purposes.anniversary'), key: 'B' },
                  { label: t('plan.purposes.couples'), key: 'C' },
                  { label: t('plan.purposes.family'), key: 'D' },
                  { label: t('plan.purposes.solo'), key: 'E' },
                  { label: t('plan.purposes.group'), key: 'F' }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => { setPurpose(opt.label); nextStep(); }}
                    className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500 text-left ${purpose === opt.label ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xl scale-[1.02]' : 'border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 hover:border-sky-300 dark:hover:border-sky-500 text-slate-900 dark:text-white'}`}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[11px] transition-colors ${purpose === opt.label ? 'bg-white/10 dark:bg-slate-950/10 text-white dark:text-slate-950' : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 shadow-sm'}`}>{opt.key}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCES */}
          {step === 2 && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="text-center">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1em] mb-6 block">{t('experiences')}</span>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight transition-colors">{t('plan.q2')}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-8 max-w-md mx-auto transition-colors">{t('plan.q2Desc')}</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { label: t('plan.experiences.snorkelling'), key: 'Snorkelling' },
                  { label: t('plan.experiences.diving'), key: 'Scuba Diving' },
                  { label: t('plan.experiences.surfing'), key: 'Surfing' },
                  { label: t('plan.experiences.spa'), key: 'Spa' },
                  { label: t('plan.experiences.food'), key: 'Food' },
                  { label: t('plan.experiences.culture'), key: 'History & Culture' }
                ].map((exp) => (
                  <button
                    key={exp.key}
                    onClick={() => toggleExperience(exp.key)}
                    className={`p-10 rounded-[3rem] border transition-all duration-700 flex flex-col items-center justify-center gap-4 text-center ${selectedExperiences.includes(exp.key) ? 'border-slate-950 dark:border-white bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-2xl scale-[1.05]' : 'border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 hover:border-sky-200 dark:hover:border-sky-500 text-slate-900 dark:text-white'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{exp.label}</span>
                    {selectedExperiences.includes(exp.key) && <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />}
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-8 pt-8">
                <button onClick={nextStep} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold px-16 py-7 rounded-full text-[11px] uppercase tracking-[0.5em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all shadow-2xl">
                  {selectedExperiences.length > 0 ? `${t('plan.next')} (${selectedExperiences.length}/3)` : t('plan.noPreferences')}
                </button>
                <button onClick={prevStep} className="text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest text-[9px] hover:text-slate-950 dark:hover:text-white transition-colors">← {t('plan.back')}</button>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES */}
          {step === 3 && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="text-center">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1em] mb-6 block">ISLANDS</span>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white transition-colors">{t('plan.q3')}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-8 transition-colors">{t('plan.q3Desc')}</p>
              </div>
              <div className="space-y-12 max-w-2xl mx-auto">
                {[
                  { key: 'islandSize', opt1: t('plan.preferences.smallIsland'), opt2: t('plan.preferences.largeIsland'), letter: 'A' },
                  { key: 'priceLevel', opt1: t('plan.preferences.luxuryResort'), opt2: t('plan.preferences.affordableResort'), letter: 'B' },
                  { key: 'villaType', opt1: t('plan.preferences.beachVilla'), opt2: t('plan.preferences.waterVilla'), letter: 'C' },
                  { key: 'pool', opt1: t('plan.preferences.pool'), opt2: t('plan.preferences.noPool'), letter: 'D' }
                ].map((row) => (
                  <div key={row.key} className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <span className="w-8 h-8 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-bold flex items-center justify-center rounded-xl shadow-lg transition-colors">{row.letter}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, [row.key]: row.opt1 }))}
                        className={`py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 border ${preferences[row.key as keyof typeof preferences] === row.opt1 ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-transparent hover:border-sky-200 dark:hover:border-sky-500'}`}
                      >
                        {row.opt1}
                      </button>
                      <span className="text-[10px] font-serif text-slate-300 dark:text-slate-700">or</span>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, [row.key]: row.opt2 }))}
                        className={`py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 border ${preferences[row.key as keyof typeof preferences] === row.opt2 ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-transparent hover:border-sky-200 dark:hover:border-sky-500'}`}
                      >
                        {row.opt2}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-8 pt-8">
                <button onClick={nextStep} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold px-16 py-7 rounded-full text-[11px] uppercase tracking-[0.5em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all shadow-2xl">{t('plan.next')}</button>
                <button onClick={prevStep} className="text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest text-[9px] hover:text-slate-950 dark:hover:text-white transition-colors">← {t('plan.back')}</button>
              </div>
            </div>
          )}

          {/* STEP 4: RESORTS */}
          {step === 4 && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="text-center">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1em] mb-6 block">{t('footer.nav.portfolio')}</span>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white transition-colors">{t('plan.q4')}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-8 transition-colors">{t('plan.q4Desc')}</p>
              </div>

              <div className="max-w-xl mx-auto space-y-12">
                <div className="relative">
                  <input 
                    type="text"
                    value={resortSearch}
                    onChange={(e) => setResortSearch(e.target.value)}
                    placeholder={t('plan.searchPlaceholder')}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-[2rem] px-10 py-6 text-[16px] md:text-[11px] font-bold uppercase tracking-[0.4em] outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-sky-300 transition-all shadow-sm placeholder:text-slate-200 dark:placeholder:text-slate-700 dark:text-white"
                  />
                  {filteredResortList.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 dark:border-white/5 overflow-hidden z-[100] p-4 space-y-2">
                      {filteredResortList.map(resort => (
                        <button
                          key={resort.id}
                          onClick={() => selectResort(resort.name)}
                          className="w-full flex items-center gap-6 p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-[1.5rem] text-left group"
                        >
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-slate-50 dark:border-white/10 group-hover:border-sky-400 transition-all">
                            <img src={resort.images[0]} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest group-hover:text-sky-500 transition-colors">{resort.name}</span>
                             <span className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">{resort.atoll}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                   {selectedResorts.map(name => {
                     const r = dbResorts.find(res => res.name === name);
                     return (
                       <div key={name} className="flex items-center justify-between p-6 bg-slate-950 dark:bg-white rounded-[2rem] text-white dark:text-slate-950 shadow-2xl animate-in zoom-in-95 duration-500 transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 dark:border-slate-950/10">
                               <img src={r?.images?.[0] || 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold uppercase tracking-widest">{name}</span>
                               <span className="text-[8px] text-white/40 dark:text-slate-950/40 uppercase tracking-widest">{r?.atoll}</span>
                            </div>
                          </div>
                          <button onClick={() => removeResort(name)} className="text-white/20 dark:text-slate-950/20 hover:text-white dark:hover:text-slate-950 transition-colors w-8 h-8 flex items-center justify-center rounded-full border border-white/5 dark:border-slate-950/5 hover:bg-white/5 dark:hover:bg-slate-950/5">&times;</button>
                       </div>
                     )
                   })}
                   {selectedResorts.length === 0 && (
                     <p className="text-center text-slate-300 dark:text-slate-700 text-[10px] font-bold uppercase tracking-[0.4em] py-12 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2.5rem] transition-colors">{t('plan.noResorts')}</p>
                   )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 pt-12">
                <button onClick={nextStep} className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold px-16 py-7 rounded-full text-[11px] uppercase tracking-[0.5em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all shadow-2xl">{t('plan.next')}</button>
                <button onClick={prevStep} className="text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest text-[9px] hover:text-slate-950 dark:hover:text-white transition-colors">← {t('plan.back')}</button>
              </div>
            </div>
          )}

          {/* STEP 5: DETAILS */}
          {step === 5 && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="text-center">
                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[1em] mb-6 block">LOGISTICS</span>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter transition-colors">{t('plan.q5')}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center rounded-lg transition-colors">A</span>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{t('plan.fullName')}</label>
                    </div>
                    <input type="text" required value={finalDetails.fullName} onChange={e => setFinalDetails(prev => ({...prev, fullName: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-5 text-[16px] md:text-[12px] font-bold uppercase tracking-widest focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-sky-300 transition-all dark:text-white" placeholder={t('plan.fullNamePlaceholder')} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center rounded-lg transition-colors">B</span>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{t('plan.phone')}</label>
                    </div>
                    <input type="tel" required value={finalDetails.phone} onChange={e => setFinalDetails(prev => ({...prev, phone: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-5 text-[16px] md:text-[12px] font-bold uppercase tracking-widest focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-sky-300 transition-all dark:text-white" placeholder="07700 900000" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center rounded-lg transition-colors">C</span>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{t('plan.email')}</label>
                    </div>
                    <input type="email" required value={finalDetails.email} onChange={e => setFinalDetails(prev => ({...prev, email: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-5 text-[16px] md:text-[12px] font-bold uppercase tracking-widest focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-sky-300 transition-all dark:text-white" placeholder={t('plan.emailPlaceholder')} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center rounded-lg transition-colors">D</span>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{t('plan.dates')}</label>
                    </div>
                    <input type="text" value={finalDetails.dates} onChange={e => setFinalDetails(prev => ({...prev, dates: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-5 text-[16px] md:text-[12px] font-bold uppercase tracking-widest focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-sky-300 transition-all dark:text-white" placeholder={t('plan.datesPlaceholder')} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center rounded-lg transition-colors">E</span>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{t('plan.guests')}</label>
                    </div>
                    <input type="number" min="1" value={finalDetails.guests} onChange={e => setFinalDetails(prev => ({...prev, guests: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-5 text-[16px] md:text-[12px] font-bold uppercase tracking-widest focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-sky-300 transition-all dark:text-white" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center rounded-lg transition-colors">F</span>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{t('plan.mealPlan')}</label>
                    </div>
                    <select value={finalDetails.mealPlan} onChange={e => setFinalDetails(prev => ({...prev, mealPlan: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/10 rounded-2xl px-8 py-5 text-[16px] md:text-[12px] font-bold uppercase tracking-widest focus:bg-white dark:focus:bg-slate-800 outline-none focus:border-sky-300 transition-all appearance-none dark:text-white">
                      <option className="dark:bg-slate-900" value="BED & BREAKFAST">{t('plan.mealPlans.bb')}</option>
                      <option className="dark:bg-slate-900" value="HALF BOARD">{t('plan.mealPlans.hb')}</option>
                      <option className="dark:bg-slate-900" value="FULL BOARD">{t('plan.mealPlans.fb')}</option>
                      <option className="dark:bg-slate-900" value="ALL INCLUSIVE">{t('plan.mealPlans.ai')}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-12 flex flex-col items-center gap-8">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold py-7 rounded-full text-[11px] uppercase tracking-[0.8em] hover:bg-sky-500 dark:hover:bg-sky-400 transition-all duration-700 shadow-2xl disabled:opacity-50">
                    {isSubmitting ? t('plan.submitting') : t('plan.submit')}
                  </button>
                  <button type="button" onClick={prevStep} className="text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest text-[9px] hover:text-slate-950 dark:hover:text-white transition-colors">← {t('plan.back')}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanMyTrip;
