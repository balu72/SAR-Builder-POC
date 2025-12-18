import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Clock, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Secure Reporting",
      description: "Bank-grade security for all your compliance reports",
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Generate reports in minutes, not hours",
    },
    {
      icon: CheckCircle,
      title: "FIU-IND Compliant",
      description: "Meets all regulatory requirements",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              SAR Portal
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-6 py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Shield className="w-4 h-4" />
              FIU-IND Compliant Reporting
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in [animation-delay:100ms] opacity-0">
              Suspicious Transaction
              <span className="text-gradient"> Report Portal</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in [animation-delay:200ms] opacity-0">
              Streamline your compliance workflow with our secure, efficient SAR reporting system. 
              Generate FIU-IND compliant reports in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:300ms] opacity-0">
              <Button 
                variant="hero" 
                onClick={() => navigate("/report")}
                className="w-full sm:w-auto"
              >
                <FileText className="w-5 h-5 mr-2" />
                Create SAR Report
              </Button>
              <Button 
                variant="heroOutline"
                className="w-full sm:w-auto"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Portal?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for banking compliance teams who need reliable, efficient reporting tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in opacity-0"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2024 SAR Portal. Compliant with FIU-IND regulations.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
