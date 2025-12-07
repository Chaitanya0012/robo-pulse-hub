import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const NetworkingDialog = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: profile?.school_email || "",
    projectDescription: profile?.project_description || "",
    lookingForPartner: profile?.looking_for_partner || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to join networking",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !formData.projectDescription.trim()) {
      toast({
        title: "Error",
        description: "Email and project description are required",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          school_email: formData.email.trim(),
          project_description: formData.projectDescription.trim(),
          looking_for_partner: formData.lookingForPartner,
        })
        .eq('id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      queryClient.invalidateQueries({ queryKey: ['partners-looking'] });

      toast({
        title: "Success",
        description: formData.lookingForPartner 
          ? "Your networking profile has been updated!"
          : "You've been removed from the networking list",
      });

      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/50">
          <Users className="h-4 w-4 mr-2" />
          Join Networking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Project Networking</DialogTitle>
          <DialogDescription>
            Connect with other students looking for project partners
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Contact Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
              maxLength={255}
            />
          </div>
          
          <div>
            <Label htmlFor="project">What are you working on? *</Label>
            <Textarea
              id="project"
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Describe your project or what kind of partner you're looking for..."
              rows={4}
              required
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.projectDescription.length}/500 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="looking"
              checked={formData.lookingForPartner}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, lookingForPartner: checked as boolean })
              }
            />
            <Label htmlFor="looking" className="text-sm cursor-pointer">
              I'm actively looking for a project partner
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Networking Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkingDialog;
