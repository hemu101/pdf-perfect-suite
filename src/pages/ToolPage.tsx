import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getToolById, getCategoryColor, getToolsByCategory } from "@/data/tools";
import { Upload, ArrowLeft, FileText, X, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ToolCard from "@/components/ToolCard";

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = getToolById(toolId || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
            <Link to="/tools">
              <Button>
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = tool.icon;
  const relatedTools = getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id)
    .slice(0, 4);

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(Array.from(selectedFiles));
    }
  };

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error("Please add at least one file");
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success("Files processed successfully!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Tool Header */}
        <section className="py-12 md:py-16 bg-gradient-hero">
          <div className="container">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all tools
            </Link>

            <div className="flex items-start gap-6">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${getCategoryColor(tool.category)} shadow-lg`}
              >
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {tool.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            {/* Drop Zone */}
            <div
              className={`relative rounded-2xl border-2 border-dashed p-12 transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
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
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
                  <Upload className="h-10 w-10 text-primary-foreground" />
                </div>

                <div className="text-center">
                  <p className="text-xl font-semibold text-foreground">
                    Drop your files here
                  </p>
                  <p className="text-muted-foreground">
                    or click the button below to browse
                  </p>
                </div>

                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5" />
                  Select Files
                </Button>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-foreground">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-foreground truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    onClick={handleProcess}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Process Files
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setFiles([])}
                    disabled={isProcessing}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}

            {/* Credits Info */}
            {tool.credits && (
              <div className="mt-8 p-4 rounded-lg bg-secondary border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {tool.credits} credits
                  </span>{" "}
                  will be used per file for this tool.{" "}
                  <Link to="/pricing" className="text-primary hover:underline">
                    View pricing
                  </Link>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="py-12 md:py-16 bg-secondary">
            <div className="container">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTools.map((relatedTool, index) => (
                  <ToolCard key={relatedTool.id} tool={relatedTool} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ToolPage;
