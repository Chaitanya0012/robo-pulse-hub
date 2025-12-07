import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MentorAnalytics {
  mentor_id: string;
  full_name: string | null;
  resources_created: number;
  total_ratings: number;
  avg_rating: number;
  total_projects: number;
}

export const useMentorAnalytics = () => {
  const { user } = useAuth();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['mentor_analytics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('mentor_analytics')
        .select('*')
        .eq('mentor_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as MentorAnalytics | null;
    },
    enabled: !!user,
  });

  return {
    analytics,
    isLoading,
  };
};
