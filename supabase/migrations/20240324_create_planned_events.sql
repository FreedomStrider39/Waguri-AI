-- Create planned_events table
CREATE TABLE IF NOT EXISTS public.planned_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_time TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.planned_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.planned_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.planned_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.planned_events FOR DELETE USING (true);