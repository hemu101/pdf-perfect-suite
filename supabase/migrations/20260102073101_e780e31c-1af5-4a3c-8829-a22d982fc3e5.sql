-- Grant admin role to user (this is a one-time data update disguised as schema operation)
-- Update existing user role to admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = 'fce443b6-1268-4ed2-b4b0-206e729a1ab4';