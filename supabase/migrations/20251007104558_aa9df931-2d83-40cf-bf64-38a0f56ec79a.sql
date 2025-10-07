-- Create resources table for user-submitted learning resources
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  url text,
  file_url text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources
CREATE POLICY "Resources are viewable by everyone"
  ON public.resources FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own resources"
  ON public.resources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resources"
  ON public.resources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resources"
  ON public.resources FOR DELETE
  USING (auth.uid() = user_id);

-- Create resource_ratings table
CREATE TABLE public.resource_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Enable RLS
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON public.resource_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON public.resource_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.resource_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.resource_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_ratings_updated_at
  BEFORE UPDATE ON public.resource_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create a view for resource statistics
CREATE VIEW public.resource_stats AS
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

-- Create a view for mentor analytics
CREATE VIEW public.mentor_analytics AS
SELECT 
  p.id as mentor_id,
  p.full_name,
  COUNT(DISTINCT r.id) as resources_created,
  COUNT(DISTINCT rr.id) as total_ratings,
  COALESCE(AVG(rr.rating), 0) as avg_rating,
  COUNT(DISTINCT proj.id) as total_projects
FROM public.profiles p
LEFT JOIN public.resources r ON p.id = r.user_id
LEFT JOIN public.resource_ratings rr ON r.id = rr.resource_id
LEFT JOIN public.projects proj ON p.id = proj.user_id
GROUP BY p.id, p.full_name;