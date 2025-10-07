-- Add email visibility and partner matching fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN email_visible boolean DEFAULT true,
ADD COLUMN looking_for_partner boolean DEFAULT false,
ADD COLUMN school_email text;

-- Add comment explaining avatar_url usage
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user profile picture. You can use image hosting services like Imgur, or upload to cloud storage to get a URL.';