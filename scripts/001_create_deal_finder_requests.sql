-- Create deal_finder_requests table to store form submissions
CREATE TABLE IF NOT EXISTS public.deal_finder_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  request_details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed'))
);

-- Add index for faster queries by status and date
CREATE INDEX IF NOT EXISTS idx_deal_finder_requests_status ON public.deal_finder_requests(status);
CREATE INDEX IF NOT EXISTS idx_deal_finder_requests_created_at ON public.deal_finder_requests(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.deal_finder_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public form submission)
CREATE POLICY "Allow public inserts on deal_finder_requests"
  ON public.deal_finder_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all requests (for admin panel)
CREATE POLICY "Allow authenticated users to view all requests"
  ON public.deal_finder_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update status
CREATE POLICY "Allow authenticated users to update requests"
  ON public.deal_finder_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
