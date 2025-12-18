import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Loader2, X, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { compressImage, downloadBlob, formatFileSize } from "@/lib/imageProcessing";
import { useCredits } from "@/hooks/useCredits";
import { useProcessingHistory } from "@/hooks/useProcessingHistory";
import { useAuth } from "@/contexts/AuthContext";

interface ImageFile {
  file: File;
  preview: string;
  processed?: Blob;
  processedPreview?: string;
  originalSize: number;
  compressedSize?: number;
}

const ImageCompressorTool = () => {
  const { user } = useAuth();
  const { credits, deductCredits } = useCredits();
  const { addRecord } = useProcessingHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) addFiles(Array.from(files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter(f => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const newImages: ImageFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size
    }));
    setImages(prev => [...prev, ...newImages]);
    toast.success(`${validFiles.length} image(s) added`);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      if (removed.processedPreview) URL.revokeObjectURL(removed.processedPreview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const processImages = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    const creditsNeeded = images.length * 2;
    if (user && credits && credits.balance < creditsNeeded) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);

    try {
      const processedImages = await Promise.all(
        images.map(async (img) => {
          const processed = await compressImage(img.file, quality);
          return {
            ...img,
            processed,
            processedPreview: URL.createObjectURL(processed),
            compressedSize: processed.size
          };
        })
      );

      setImages(processedImages);

      // Deduct credits if user is logged in
      if (user) {
        await deductCredits(creditsNeeded, "compress-image", `Compressed ${images.length} images`);
      }

      // Add to history
      for (const img of processedImages) {
        await addRecord({
          toolId: "compress-image",
          fileName: img.file.name,
          fileSize: img.file.size,
          outputFormat: "jpeg",
          creditsUsed: 2,
          status: "completed",
          metadata: { quality, compressionRatio: img.compressedSize! / img.originalSize }
        });
      }

      const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
      const totalCompressed = processedImages.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
      const savedPercent = Math.round((1 - totalCompressed / totalOriginal) * 100);

      toast.success(`Saved ${savedPercent}% - ${formatFileSize(totalOriginal - totalCompressed)} reduced!`);
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process images");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    images.forEach((img) => {
      if (img.processed) {
        const baseName = img.file.name.replace(/\.[^/.]+$/, "");
        downloadBlob(img.processed, `${baseName}_compressed.jpg`);
      }
    });
    toast.success("Downloads started");
  };

  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressed = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0);

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-card hover:border-primary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
            <Upload className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">Drag & drop images</p>
            <p className="text-muted-foreground">or browse files</p>
          </div>
          <Button variant="hero" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Select Images
          </Button>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, WebP • Max 10MB per file
          </p>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((img, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-border">
              <img
                src={img.processedPreview || img.preview}
                alt={img.file.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{img.file.name}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{formatFileSize(img.originalSize)}</span>
                  {img.compressedSize && (
                    <>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-green-500 font-medium">{formatFileSize(img.compressedSize)}</span>
                      <span className="text-green-500">
                        (-{Math.round((1 - img.compressedSize / img.originalSize) * 100)}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeImage(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Quality Slider */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="font-semibold text-foreground">Compression Level</h3>
          <span className="text-primary font-medium">{quality}%</span>
        </div>
        <Slider
          value={[quality]}
          onValueChange={([v]) => setQuality(v)}
          min={10}
          max={100}
          step={5}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Maximum compression</span>
          <span>Best quality</span>
        </div>
      </div>

      {/* Stats */}
      {totalCompressed > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Original</p>
            <p className="text-lg font-bold text-foreground">{formatFileSize(totalOriginal)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Compressed</p>
            <p className="text-lg font-bold text-green-500">{formatFileSize(totalCompressed)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Saved</p>
            <p className="text-lg font-bold text-green-500">
              {Math.round((1 - totalCompressed / totalOriginal) * 100)}%
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {images.length > 0 && (
        <div className="flex gap-4">
          <Button
            variant="hero"
            size="lg"
            className="flex-1"
            onClick={processImages}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Minimize2 className="h-5 w-5" />
                Compress Images
              </>
            )}
          </Button>
          {images.some(img => img.processed) && (
            <Button variant="outline" size="lg" onClick={downloadAll}>
              <Download className="h-5 w-5" />
              Download All
            </Button>
          )}
        </div>
      )}

      {/* Credits Info */}
      {user && credits && (
        <div className="p-4 rounded-lg bg-secondary border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">2 credits</span> per image.
            Your balance: <span className="font-medium text-primary">{credits.balance} credits</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageCompressorTool;
