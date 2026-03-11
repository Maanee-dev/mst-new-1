import React from 'react';
import SEO from '../components/SEO';
import { Shield, Lock, Eye, FileText, Trash2, Globe, AlertCircle } from 'lucide-react';

const Privacy: React.FC = () => {
  
  return (
    <div className="bg-[#FCFAF7] dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-700">
      <SEO 
        title="Privacy Policy | Maldives Serenity Travels" 
        description="Our commitment to protecting your personal data and privacy. Comprehensive privacy policy for Maldives Serenity Travels."
        keywords={['Maldives travel privacy', 'data protection Maldives', 'Serenity Maldives privacy', 'Google API privacy policy']}
      />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1510011564758-29df30730163?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Texture"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1.2em] mb-8 block">Governance & Trust</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter italic leading-none">
            Privacy <br /> Policy.
          </h1>
          <div className="h-px w-16 bg-amber-400 mx-auto mt-8 mb-8"></div>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.5em]">Effective Date: March 11, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-2xl border border-slate-100 dark:border-white/5 transition-colors duration-700">
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Shield className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">1. Introduction</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Our Commitment to You</p>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-12">
              Maldives Serenity Travels ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share, and protect information when you use our website, services, and applications, including those that integrate with Google APIs and services.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-12">
              This policy complies with the <strong>Google API Services User Data Policy</strong> and <strong>Google APIs Terms of Service</strong>, as required for applications accessing Google user data through OAuth verification.
            </p>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Eye className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">2. Data We Access (Google User Data)</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Transparency in Access</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-8">
              Our application may access the following types of Google user data, depending on the scopes you authorize:
            </p>

            <div className="overflow-x-auto mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Data Category</th>
                    <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Specific Data Accessed</th>
                    <th className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-50 dark:border-white/5">
                    <td className="py-4 font-bold">Basic Profile</td>
                    <td className="py-4">Name, email address, profile picture</td>
                    <td className="py-4">Account creation, user identification, and personalized service</td>
                  </tr>
                  <tr className="border-b border-slate-50 dark:border-white/5">
                    <td className="py-4 font-bold">Email Information</td>
                    <td className="py-4">Gmail messages (read-only, specific to booking confirmations)</td>
                    <td className="py-4">Extracting travel booking details to assist with itinerary planning</td>
                  </tr>
                  <tr className="border-b border-slate-50 dark:border-white/5">
                    <td className="py-4 font-bold">Calendar Data</td>
                    <td className="py-4">Google Calendar events, dates, times</td>
                    <td className="py-4">Synchronizing travel itineraries and booking schedules</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">Contact Information</td>
                    <td className="py-4">Google Contacts (if shared)</td>
                    <td className="py-4">Facilitating group travel planning and emergency contact setup</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-2xl border border-sky-100 dark:border-sky-500/20 mb-12">
              <p className="text-sky-800 dark:text-sky-300 text-xs font-bold uppercase tracking-widest m-0">Important Note</p>
              <p className="text-sky-700 dark:text-sky-400 text-sm m-0 mt-2">
                We only request access to the <strong>minimum necessary scopes</strong> required to provide our travel planning services. We do not access sensitive data categories beyond what is explicitly authorized by you.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Lock className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">3. How We Use Your Data</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Purposeful Processing</p>
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">3.1 Travel Planning & Booking Services</h4>
                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-2 list-disc pl-5">
                  <li>Creating and managing your personalized Maldives travel itineraries</li>
                  <li>Processing resort bookings, transfers, and activity reservations</li>
                  <li>Sending booking confirmations and travel documentation</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">3.2 Account Management</h4>
                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-2 list-disc pl-5">
                  <li>Authenticating your identity and maintaining your user account</li>
                  <li>Providing customer support and responding to inquiries</li>
                  <li>Sending service-related notifications and updates</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">3.3 Personalization</h4>
                <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-2 list-disc pl-5">
                  <li>Tailoring travel recommendations based on your preferences</li>
                  <li>Synchronizing your travel schedule with your Google Calendar</li>
                  <li>Extracting booking details from Gmail to auto-populate itineraries</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5 mb-12">
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-4">We do NOT use your data for:</h4>
              <ul className="text-slate-500 dark:text-slate-400 text-xs space-y-2 font-bold uppercase tracking-widest">
                <li>• Advertising or marketing unrelated to your specific travel plans</li>
                <li>• Selling data to third parties</li>
                <li>• AI/ML model training (see Section 8)</li>
                <li>• Any purpose not explicitly disclosed in this policy</li>
              </ul>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Globe className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">4. Data Sharing Practices</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Controlled Dissemination</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
              We share Google user data and personal information only with trusted partners necessary for fulfilling your travel arrangements:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">Resort Partners</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Confirming reservations and personalizing your stay with your preferences.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2">Transfer Operators</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Arranging seaplane, domestic flight, or speedboat transfers based on your flight details.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <FileText className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">5. Data Storage & Protection</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Fortifying Your Sanctuary</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
              We implement industry-standard security protocols including TLS 1.3 encryption for data in transit and AES-256 for data at rest. Google user data is stored separately from general user data with strict access controls.
            </p>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <Trash2 className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">6. Data Retention & Deletion</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Your Right to be Forgotten</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
              You have the right to request deletion of your data at any time. Google user data is automatically purged when you revoke OAuth access.
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-3xl border border-amber-100 dark:border-amber-500/20 mb-12">
              <h4 className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-[0.3em] mb-4">How to Delete Your Data:</h4>
              <div className="space-y-4 text-sm text-amber-800 dark:text-amber-400">
                <p><strong>Option 1:</strong> Log into your account → Settings → "Delete My Account"</p>
                <p><strong>Option 2:</strong> Email <span className="font-bold">privacy@maldives-serenitytravels.com</span> with subject "Data Deletion Request"</p>
                <p><strong>Option 3:</strong> Revoke access at <a href="https://myaccount.google.com/permissions" className="underline font-bold">Google Permissions</a></p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-slate-100 dark:border-white/5">
              <AlertCircle className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-2xl font-serif italic m-0 text-slate-900 dark:text-white">8. AI/ML Model Training Disclosure</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest m-0 mt-1">Workspace API Integrity</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-12">
              Maldives Serenity Travels <strong>DOES NOT</strong> use Google user data obtained through Workspace APIs (Gmail, Google Calendar, Google Drive, etc.) to develop, improve, or train generic artificial intelligence (AI) models, machine learning (ML) algorithms, or large language models (LLMs).
            </p>

            <div className="pt-12 border-t border-slate-100 dark:border-white/5 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mb-4">Contact Our Data Protection Officer</p>
              <p className="text-slate-900 dark:text-white font-serif italic text-xl">privacy@maldives-serenitytravels.com</p>
              <p className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-8">© 2026 Maldives Serenity Travels. Registered in the Republic of Maldives.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
