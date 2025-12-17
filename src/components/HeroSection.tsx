import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

const HeroSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    toast.success(`File "${file.name}" selected! Choose a tool to process it.`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            All-in-one PDF & Image Tools
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Every tool you need to work with{" "}
            <span className="text-gradient">PDFs & Images</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-slide-up stagger-1">
            Merge, split, compress, convert, rotate, unlock and watermark PDFs.
            Edit images, remove backgrounds, and more — all in one place.
          </p>

          {/* Upload Area */}
          <div
            className={`relative mx-auto max-w-xl rounded-2xl border-2 border-dashed p-8 md:p-12 transition-all duration-300 animate-slide-up stagger-2 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border bg-card hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="hidden"
              onChange={handleFileSelect}
              multiple
            />

            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg animate-float">
                <Upload className="h-8 w-8 text-primary-foreground" />
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Drop your files here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>

              <Button
                variant="hero"
                size="xl"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                <Upload className="h-5 w-5" />
                Select Files
              </Button>

              <p className="text-xs text-muted-foreground">
                Supports PDF, JPG, PNG, Word, Excel, PowerPoint
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 animate-slide-up stagger-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-convert-to" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-5 w-5 text-security" />
              <span>Fast Processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-5 w-5 text-edit" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
