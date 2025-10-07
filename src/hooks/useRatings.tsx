import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Rating {
  id: string;
  resource_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}

export const useRatings = (resourceId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ratings, isLoading } = useQuery({
    queryKey: ['ratings', resourceId],
    queryFn: async () => {
      if (!resourceId) return [];
      
      const { data, error } = await supabase
        .from('resource_ratings')
        .select('*')
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Rating[];
    },
    enabled: !!resourceId,
  });

  const { data: userRating } = useQuery({
    queryKey: ['user_rating', resourceId, user?.id],
    queryFn: async () => {
      if (!resourceId || !user) return null;
      
      const { data, error } = await supabase
        .from('resource_ratings')
        .select('*')
        .eq('resource_id', resourceId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Rating | null;
    },
    enabled: !!resourceId && !!user,
  });

  const submitRating = useMutation({
    mutationFn: async ({ rating, review }: { rating: number; review?: string }) => {
      if (!user || !resourceId) throw new Error('Not authenticated or no resource');

      if (userRating) {
        // Update existing rating
        const { error } = await supabase
          .from('resource_ratings')
          .update({ rating, review })
          .eq('id', userRating.id);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('resource_ratings')
          .insert({ resource_id: resourceId, user_id: user.id, rating, review });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['user_rating', resourceId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    ratings: ratings || [],
    userRating,
    isLoading,
    submitRating: submitRating.mutate,
  };
};
