import React from 'react';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  return (
    <div className="bg-[#FCFAF7] min-h-screen pb-32">
      <SEO 
        title="Privacy Policy | Digital Sanctity" 
        description="Our commitment to protecting your personal data and maintaining the confidentiality of your travel vision."
      />
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1510011564758-29df30730163?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Maldives Texture"
          />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>
        <div className="relative z-10 text-center px-6 reveal active">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-[1.2em] mb-8 block">Governance</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter italic leading-none">
            Privacy <br /> Policy.
          </h1>
          <div className="h-px w-16 bg-amber-400 mx-auto mt-8 mb-8"></div>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.5em]">Updated January 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 prose prose-slate prose-lg -mt-16 relative z-20">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-slate-50">
          <h2 className="font-serif italic text-3xl mb-8">The Sanctity of Data</h2>
          <p className="text-slate-600 leading-loose text-sm mb-12">
            Your travel vision is personal. At Serenity Maldives, we treat your data with the same level of care we apply to our bespoke itineraries. This policy outlines how we handle the digital footprints you leave with us.
          </p>

          <h2 className="font-serif italic text-3xl mb-8">1. Information We Collect</h2>
          <p className="text-slate-600 leading-loose text-sm mb-12">
            We collect personal identity data (name, email, phone) only when you initiate an inquiry. To facilitate bookings, we may require passport details and dietary preferences. We also collect anonymized behavioral data to refine our digital perspective.
          </p>

          <h2 className="font-serif italic text-3xl mb-8">2. Use of Information</h2>
          <p className="text-slate-600 leading-loose text-sm mb-12">
            We use your data exclusively to curate your Maldivian journey. This includes sharing necessary details with resorts and transfer operators. We do not sell or trade your personal narrative to third-party marketers.
          </p>

          <h2 className="font-serif italic text-3xl mb-8">3. Digital Security</h2>
          <p className="text-slate-600 leading-loose text-sm mb-12">
            Our platform utilizes industry-standard encryption. Financial transactions are processed through secure, PCI-compliant gateways. We maintain rigorous internal protocols to ensure your data remains within our sanctuary.
          </p>

          <h2 className="font-serif italic text-3xl mb-8">4. Your Rights</h2>
          <p className="text-slate-600 leading-loose text-sm">
            You have the right to request a full transcript of the data we hold on you, or to request its immediate erasure from our digital archives. Contact our Data Officer at privacy@maldives-serenitytravels.com for any inquiries.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;