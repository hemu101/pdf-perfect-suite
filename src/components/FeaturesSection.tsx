import { Shield, Zap, Globe, Cloud, Lock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Processing",
    description:
      "Your files are processed securely and deleted automatically after conversion.",
    color: "text-convert-to",
    bgColor: "bg-convert-to/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Our optimized servers process your files in seconds, not minutes.",
    color: "text-security",
    bgColor: "bg-security/10",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Access from any browser on any device. No installation required.",
    color: "text-convert-from",
    bgColor: "bg-convert-from/10",
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description:
      "Save your processed files to the cloud and access them anywhere.",
    color: "text-edit",
    bgColor: "bg-edit/10",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "We never read your files. Everything is encrypted end-to-end.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Full functionality on mobile devices. Edit PDFs on the go.",
    color: "text-image",
    bgColor: "bg-image/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
            Why choose PDFTools?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by millions of users worldwide for reliable, fast, and
            secure document processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-card border border-border hover:shadow-card-hover transition-all duration-300 animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} mb-4 transition-transform group-hover:scale-110`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
