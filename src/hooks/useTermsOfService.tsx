import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TermsOfService {
  id: string;
  content: string;
  version: string;
  effective_date: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const useTermsOfService = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: latestTerms, isLoading } = useQuery({
    queryKey: ['terms-of-service'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('terms_of_service')
        .select('*')
        .order('effective_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as TermsOfService | null;
    },
  });

  const createTerms = useMutation({
    mutationFn: async (newTerms: { content: string; version: string }) => {
      const { error } = await supabase
        .from('terms_of_service')
        .insert(newTerms);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms-of-service'] });
      toast({
        title: "Success",
        description: "Terms of service updated successfully",
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
    latestTerms,
    isLoading,
    createTerms: createTerms.mutate,
  };
};
