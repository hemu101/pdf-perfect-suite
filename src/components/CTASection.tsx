import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-primary-foreground">
            <Sparkles className="h-4 w-4" />
            Start for free
          </div>

          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl mb-6">
            Ready to boost your productivity?
          </h2>

          <p className="text-lg text-primary-foreground/90 mb-10 max-w-xl mx-auto">
            Join millions of users who trust PDFTools for their document needs.
            No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/tools">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="xl"
                variant="outline"
                className="border-2 border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:border-white/50"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
