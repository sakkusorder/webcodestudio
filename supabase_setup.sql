-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    "image" TEXT,
    "coverImage" TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    "previewVideo" TEXT,
    price TEXT,
    description TEXT,
    "shortDescription" TEXT,
    technology JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    "demoUrl" TEXT,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "deliveryTime" TEXT,
    "startingPrice" NUMERIC,
    "offerPrice" NUMERIC,
    "minAdvancePercentage" NUMERIC,
    "lastUpdated" TEXT,
    status TEXT,
    "urgentDeliveryPossible" BOOLEAN,
    "urgentDeliveryCharge" NUMERIC,
    "installmentAvailable" BOOLEAN,
    "installmentOptions" JSONB DEFAULT '[]'::jsonb,
    "downPaymentAmount" NUMERIC,
    "adminStatus" TEXT DEFAULT 'Active',
    "totalOrders" NUMERIC DEFAULT 0,
    "isFeatured" BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    "isClientProject" BOOLEAN DEFAULT false,
    visibility TEXT DEFAULT 'Public',
    "displayOrder" NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.templates FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.templates FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.templates FOR DELETE USING (true);
