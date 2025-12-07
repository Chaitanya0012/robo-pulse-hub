import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTermsOfService } from "@/hooks/useTermsOfService";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminTerms = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { latestTerms, createTerms } = useTermsOfService();
  const navigate = useNavigate();
  
  const [version, setVersion] = useState("");
  const [content, setContent] = useState("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-cosmic">
        <Navigation />
        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to access this page. Admin access required.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim() || !content.trim()) {
      return;
    }
    createTerms({ version: version.trim(), content: content.trim() });
    setVersion("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold mb-2">Manage Terms of Service</h1>
            <p className="text-muted-foreground">Update the terms of service for your platform</p>
          </div>

          {latestTerms && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 mb-8 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2">Current Terms</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Version {latestTerms.version} • Last updated {new Date(latestTerms.updated_at).toLocaleDateString()}
              </p>
              <Button variant="outline" onClick={() => navigate("/terms")}>
                View Current Terms
              </Button>
            </Card>
          )}

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="version">Version Number</Label>
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g., 1.0, 2.1, etc."
                  required
                  maxLength={20}
                />
              </div>

              <div>
                <Label htmlFor="content">Terms Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the full terms of service content here..."
                  rows={20}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Tip: You can use plain text formatting. Line breaks will be preserved.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Publish New Terms
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTerms;
