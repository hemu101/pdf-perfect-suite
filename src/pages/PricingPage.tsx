import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for occasional use",
    features: [
      "5 free tasks per day",
      "Basic PDF tools",
      "Standard processing speed",
      "File size limit: 15MB",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For power users and professionals",
    features: [
      "Unlimited tasks",
      "All PDF & Image tools",
      "Priority processing",
      "File size limit: 100MB",
      "Batch processing",
      "Priority email support",
      "No watermarks",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "per month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "5 team members",
      "File size limit: 500MB",
      "API access",
      "Custom branding",
      "Dedicated support",
      "SSO integration",
      "Analytics dashboard",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const creditPricing = [
  { tool: "Merge PDF", credits: 5 },
  { tool: "Split PDF", credits: 5 },
  { tool: "Compress PDF", credits: 10 },
  { tool: "Office to PDF", credits: 10 },
  { tool: "PDF OCR", credits: "5 per page" },
  { tool: "Rotate PDF", credits: 10 },
  { tool: "PDF to JPG", credits: 10 },
  { tool: "Image to PDF", credits: 10 },
  { tool: "Compress Image", credits: 2 },
  { tool: "Background Removal", credits: 10 },
  { tool: "Upscale Image", credits: 20 },
  { tool: "Digital Signature", credits: 80 },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-hero">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Simple, transparent pricing
              </div>
              <h1 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mb-6">
                Choose the right plan for you
              </h1>
              <p className="text-lg text-muted-foreground">
                Start for free and upgrade as you grow. No hidden fees, no
                surprises.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col p-8 rounded-2xl border-2 transition-all duration-300 animate-slide-up opacity-0",
                    plan.popular
                      ? "border-primary bg-card shadow-lg scale-105"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-convert-to shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credit Pricing */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                Credit Usage
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Each tool uses a specific number of credits. Here's a breakdown
                of credit costs per operation.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted font-semibold text-foreground">
                  <span>Tool</span>
                  <span className="text-right">Credits per file</span>
                </div>
                <div className="divide-y divide-border">
                  {creditPricing.map((item) => (
                    <div
                      key={item.tool}
                      className="grid grid-cols-2 gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-foreground">{item.tool}</span>
                      <span className="text-right text-muted-foreground">
                        {item.credits} credits
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Check our FAQ or contact our support team
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">View FAQ</Button>
              <Button variant="hero">Contact Support</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
