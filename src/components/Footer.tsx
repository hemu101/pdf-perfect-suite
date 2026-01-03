import { Link } from "react-router-dom";
import { FileText, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Home", href: "/" },
      { name: "Features", href: "/tools" },
      { name: "Pricing", href: "/pricing" },
      { name: "FAQ", href: "#" },
    ],
    tools: [
      { name: "Merge PDF", href: "/tool/merge-pdf" },
      { name: "Split PDF", href: "/tool/split-pdf" },
      { name: "Compress PDF", href: "/tool/compress-pdf" },
      { name: "Convert PDF", href: "/tools?category=convert-from" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/docs#api" },
      { name: "Desktop App", href: "#" },
      { name: "Mobile App", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-md">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                PDF<span className="text-primary">Tools</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Every tool you need to work with PDFs and images in one place.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 PDFTools. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for productivity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
