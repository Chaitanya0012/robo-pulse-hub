import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
}

export const useBadges = () => {
  const { user } = useAuth();

  const { data: badges, isLoading } = useQuery({
    queryKey: ['badges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      // Get user's earned badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', user.id);

      if (userBadgesError) throw userBadgesError;

      // Combine the data
      const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
      
      return allBadges?.map(badge => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id),
        earned_at: userBadges?.find(ub => ub.badge_id === badge.id)?.earned_at,
      })) as Badge[] || [];
    },
    enabled: !!user,
  });

  return {
    badges: badges || [],
    isLoading,
  };
};
