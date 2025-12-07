import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Edit } from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";

interface EditProjectDialogProps {
  project: Project;
}

export const EditProjectDialog = ({ project }: EditProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const { updateProject } = useProjects();
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || "",
    progress: project.progress,
    deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
    roadmap: project.roadmap || "",
    help_request: project.help_request || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject({
      id: project.id,
      updates: {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progress: {formData.progress}%</Label>
            <Slider
              id="progress"
              min={0}
              max={100}
              step={5}
              value={[formData.progress]}
              onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roadmap">Project Roadmap</Label>
            <Textarea
              id="roadmap"
              placeholder="Outline your project steps..."
              value={formData.roadmap}
              onChange={(e) => setFormData({ ...formData, roadmap: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="help_request">Need Help With?</Label>
            <Textarea
              id="help_request"
              placeholder="Describe where you need assistance..."
              value={formData.help_request}
              onChange={(e) => setFormData({ ...formData, help_request: e.target.value })}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
