
-- Supabase Schema for Maldives Serenity Travels Referral & Inquiry System

-- 1. Profiles Table (Referrers)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    referral_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Active', 'Pending', 'Suspended')),
    joined_date TIMESTAMPTZ DEFAULT NOW(),
    total_earnings NUMERIC(10, 2) DEFAULT 0.00,
    available_earnings NUMERIC(10, 2) DEFAULT 0.00,
    total_clicks INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    confirmed_bookings INTEGER DEFAULT 0,
    payout_method TEXT,
    payout_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inquiries Table (Leads & Deals)
CREATE TABLE IF NOT EXISTS public.referral_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resort TEXT,
    travel_dates TEXT,
    guests TEXT,
    message TEXT,
    status TEXT DEFAULT 'Inquired' CHECK (status IN ('Clicked', 'Inquired', 'Booked', 'Confirmed', 'Paid')),
    stage TEXT DEFAULT 'New' CHECK (stage IN ('New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost')),
    value NUMERIC(10, 2),
    reward NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payouts Table
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    method TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Cancelled')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    notes TEXT
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- Inquiries: Partners can only see inquiries linked to them
CREATE POLICY "Partners can view own inquiries" 
    ON public.referral_inquiries FOR SELECT 
    USING (partner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Allow public to create inquiries (from the partner inquiry page)
CREATE POLICY "Public can create inquiries" 
    ON public.referral_inquiries FOR INSERT 
    WITH CHECK (true);

-- Payouts: Partners can only see their own payouts
CREATE POLICY "Partners can view own payouts" 
    ON public.payouts FOR SELECT 
    USING (partner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- 6. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_referral_inquiries_updated_at BEFORE UPDATE ON public.referral_inquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. Helper Function to increment clicks
CREATE OR REPLACE FUNCTION increment_partner_clicks(code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.profiles 
    SET total_clicks = total_clicks + 1 
    WHERE referral_code = code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
