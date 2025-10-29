-- Fix profiles table RLS - require authentication to view profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Create terms_of_service table for managing TOS content
CREATE TABLE public.terms_of_service (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  version text NOT NULL,
  effective_date timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.terms_of_service ENABLE ROW LEVEL SECURITY;

-- Everyone can read the latest terms
CREATE POLICY "Anyone can view terms of service"
ON public.terms_of_service
FOR SELECT
USING (true);

-- Only admins can insert/update terms
CREATE POLICY "Admins can insert terms"
ON public.terms_of_service
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update terms"
ON public.terms_of_service
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add project_description to profiles for networking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS project_description text;

-- Add trigger for terms_of_service updated_at
CREATE TRIGGER update_terms_of_service_updated_at
BEFORE UPDATE ON public.terms_of_service
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix resource_stats view to respect RLS
DROP VIEW IF EXISTS public.resource_stats;

CREATE VIEW public.resource_stats 
WITH (security_invoker=true) AS
SELECT 
  r.id,
  r.title,
  r.category,
  r.user_id,
  COUNT(DISTINCT rr.id) as rating_count,
  COALESCE(AVG(rr.rating), 0) as avg_rating
FROM public.resources r
LEFT JOIN public.resource_ratings rr ON r.id = rr.resource_id
GROUP BY r.id, r.title, r.category, r.user_id;

-- Fix mentor_analytics view to respect RLS  
DROP VIEW IF EXISTS public.mentor_analytics;

CREATE VIEW public.mentor_analytics
WITH (security_invoker=true) AS
SELECT 
  p.id as mentor_id,
  p.full_name,
  COUNT(DISTINCT proj.id) as total_projects,
  COUNT(DISTINCT r.id) as resources_created,
  COUNT(DISTINCT rr.id) as total_ratings,
  COALESCE(AVG(rr.rating), 0) as avg_rating
FROM public.profiles p
LEFT JOIN public.projects proj ON p.id = proj.user_id
LEFT JOIN public.resources r ON p.id = r.user_id
LEFT JOIN public.resource_ratings rr ON r.id = rr.resource_id
GROUP BY p.id, p.full_name;