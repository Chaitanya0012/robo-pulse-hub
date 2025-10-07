import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  url: string | null;
  file_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceWithStats extends Resource {
  rating_count: number;
  avg_rating: number;
}

export const useResources = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ResourceWithStats[];
    },
  });

  const createResource = useMutation({
    mutationFn: async (newResource: Omit<Resource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('resources')
        .insert({ ...newResource, user_id: user.id });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: "Success",
        description: "Resource created successfully",
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
    resources: resources || [],
    isLoading,
    createResource: createResource.mutate,
  };
};
