import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, BookOpen, Award, Star } from "lucide-react";
import { useMentorAnalytics } from "@/hooks/useMentorAnalytics";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const { user, loading } = useAuth();
  const { analytics, isLoading } = useMentorAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const overallStats = [
    { 
      title: "Resources Created", 
      value: analytics?.resources_created?.toString() || "0", 
      icon: BookOpen, 
      color: "primary" as const 
    },
    { 
      title: "Total Projects", 
      value: analytics?.total_projects?.toString() || "0", 
      icon: TrendingUp, 
      color: "secondary" as const 
    },
    { 
      title: "Total Ratings", 
      value: analytics?.total_ratings?.toString() || "0", 
      icon: Award, 
      color: "success" as const 
    },
    { 
      title: "Average Rating", 
      value: analytics?.avg_rating?.toFixed(1) || "0.0", 
      icon: Star, 
      color: "primary" as const 
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold mb-2">Your Analytics</h1>
            <p className="text-muted-foreground">Track your contributions and impact</p>
          </div>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overallStats.map((stat, index) => (
              <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <StatsCard {...stat} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
