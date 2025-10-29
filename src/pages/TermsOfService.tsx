import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useTermsOfService } from "@/hooks/useTermsOfService";
import { format } from "date-fns";

const TermsOfService = () => {
  const { latestTerms, isLoading } = useTermsOfService();

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            {latestTerms && (
              <p className="text-muted-foreground">
                Version {latestTerms.version} • Effective {format(new Date(latestTerms.effective_date), "MMMM d, yyyy")}
              </p>
            )}
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading terms of service...</p>
              </div>
            ) : latestTerms ? (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{latestTerms.content}</div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No terms of service have been published yet.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
