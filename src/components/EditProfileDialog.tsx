import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, HelpCircle } from "lucide-react";
import { useProfile, Profile } from "@/hooks/useProfile";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditProfileDialogProps {
  profile: Profile;
}

export const EditProfileDialog = ({ profile }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const { updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    avatar_url: profile.avatar_url || "",
    email_visible: profile.email_visible,
    looking_for_partner: profile.looking_for_partner,
    school_email: profile.school_email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Upload your image to a free hosting service like Imgur, then paste the URL here. Leave empty to use your initials.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="avatar_url"
              type="url"
              placeholder="https://i.imgur.com/yourimage.jpg"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            />
          </div>

          <div className="space-y-4 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_visible">Show Email on Profile</Label>
                <p className="text-sm text-muted-foreground">Let others see your email address</p>
              </div>
              <Switch
                id="email_visible"
                checked={formData.email_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, email_visible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="looking_for_partner">Looking for Project Partner</Label>
                <p className="text-sm text-muted-foreground">Show your name on the home page</p>
              </div>
              <Switch
                id="looking_for_partner"
                checked={formData.looking_for_partner}
                onCheckedChange={(checked) => setFormData({ ...formData, looking_for_partner: checked })}
              />
            </div>

            {formData.looking_for_partner && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                <Label htmlFor="school_email">School Email Address</Label>
                <Input
                  id="school_email"
                  type="email"
                  placeholder="your.name@school.edu"
                  value={formData.school_email}
                  onChange={(e) => setFormData({ ...formData, school_email: e.target.value })}
                  required={formData.looking_for_partner}
                />
                <p className="text-xs text-muted-foreground">Required to be visible on home page</p>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
