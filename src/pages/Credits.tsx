import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Heart, Zap } from "lucide-react";

const Credits = () => {
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-6">
              <Zap className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4">RoboJourney</h1>
            <p className="text-xl text-muted-foreground">
              Built for the robotics community
            </p>
          </div>

          <Card className="p-8 mb-6 bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 backdrop-blur-sm border-primary/30 animate-fade-in">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Created by</h2>
                <p className="text-xl text-primary font-semibold">
                  Chaitanya Prabhakar
                </p>
                <p className="text-muted-foreground">
                  Secretary of Robotics Society 2025
                </p>
              </div>

              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-semibold">Special Thanks</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Vibhav Anand Sir</span>
                    <br />
                    for his invaluable support and guidance
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Ark Das</span>
                    <br />
                    Head of Robotics Society - 2025
                    <br />
                    for his continuous support
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground animate-fade-in">
            <p>© 2025 RoboJourney. Built with passion for robotics education.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
