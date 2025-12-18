import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Loader2, X, Image as ImageIcon, FileImage } from "lucide-react";
import { toast } from "sonner";
import { convertImage, downloadBlob, formatFileSize } from "@/lib/imageProcessing";
import { useCredits } from "@/hooks/useCredits";
import { useProcessingHistory } from "@/hooks/useProcessingHistory";
import { useAuth } from "@/contexts/AuthContext";

type OutputFormat = "jpeg" | "png" | "webp" | "gif" | "bmp";
type ResizeMode = "original" | "scale" | "custom" | "presets";

interface ImageFile {
  file: File;
  preview: string;
  processed?: Blob;
  processedPreview?: string;
}

const presets = [
  { name: "HD 720p", width: 1280, height: 720 },
  { name: "Full HD 1080p", width: 1920, height: 1080 },
  { name: "4K", width: 3840, height: 2160 },
  { name: "Instagram Square", width: 1080, height: 1080 },
  { name: "Twitter Header", width: 1500, height: 500 },
];

const ImageConverterTool = () => {
  const { user } = useAuth();
  const { credits, deductCredits } = useCredits();
  const { addRecord } = useProcessingHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [images, setImages] = useState<ImageFile[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [quality, setQuality] = useState(85);
  const [resizeMode, setResizeMode] = useState<ResizeMode>("original");
  const [scale, setScale] = useState(100);
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [selectedPreset, setSelectedPreset] = useState(0);
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
      preview: URL.createObjectURL(file)
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
          const options: any = { format: outputFormat, quality };
          
          if (resizeMode === "scale") {
            options.scale = scale;
          } else if (resizeMode === "custom") {
            options.width = customWidth;
            options.height = customHeight;
          } else if (resizeMode === "presets") {
            const preset = presets[selectedPreset];
            options.width = preset.width;
            options.height = preset.height;
          }

          const processed = await convertImage(img.file, options);
          return {
            ...img,
            processed,
            processedPreview: URL.createObjectURL(processed)
          };
        })
      );

      setImages(processedImages);

      // Deduct credits if user is logged in
      if (user) {
        await deductCredits(creditsNeeded, "convert-image", `Converted ${images.length} images to ${outputFormat.toUpperCase()}`);
      }

      // Add to history
      for (const img of processedImages) {
        await addRecord({
          toolId: "convert-image",
          fileName: img.file.name,
          fileSize: img.file.size,
          outputFormat,
          creditsUsed: 2,
          status: "completed",
          metadata: { quality, resizeMode }
        });
      }

      toast.success("Images converted successfully!");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process images");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      if (img.processed) {
        const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
        const baseName = img.file.name.replace(/\.[^/.]+$/, "");
        downloadBlob(img.processed, `${baseName}_converted.${ext}`);
      }
    });
    toast.success("Downloads started");
  };

  const formats: { id: OutputFormat; name: string }[] = [
    { id: "jpeg", name: "JPEG" },
    { id: "png", name: "PNG" },
    { id: "webp", name: "WebP" },
    { id: "gif", name: "GIF" },
    { id: "bmp", name: "BMP" },
  ];

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
            Supports JPG, PNG, WebP, GIF, BMP, TIFF, HEIC • Max 10MB per file
          </p>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-border">
              <img
                src={img.processedPreview || img.preview}
                alt={img.file.name}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
                <p className="text-xs truncate">{img.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(img.processed?.size || img.file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Output Format */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Output Format</h3>
          <div className="flex flex-wrap gap-2">
            {formats.map((format) => (
              <Button
                key={format.id}
                variant={outputFormat === format.id ? "hero" : "outline"}
                size="sm"
                onClick={() => setOutputFormat(format.id)}
              >
                {format.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="font-semibold text-foreground">Quality</h3>
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
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      </div>

      {/* Resize Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Resize Options</h3>
        <div className="flex flex-wrap gap-2">
          {(["original", "scale", "custom", "presets"] as ResizeMode[]).map((mode) => (
            <Button
              key={mode}
              variant={resizeMode === mode ? "hero" : "outline"}
              size="sm"
              onClick={() => setResizeMode(mode)}
              className="capitalize"
            >
              {mode === "scale" ? "Scale %" : mode}
            </Button>
          ))}
        </div>

        {resizeMode === "scale" && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Scale</span>
              <span className="text-primary font-medium">{scale}%</span>
            </div>
            <Slider
              value={[scale]}
              onValueChange={([v]) => setScale(v)}
              min={10}
              max={200}
              step={10}
            />
          </div>
        )}

        {resizeMode === "custom" && (
          <div className="mt-4 flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Width (px)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">Height (px)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
        )}

        {resizeMode === "presets" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((preset, i) => (
              <Button
                key={i}
                variant={selectedPreset === i ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPreset(i)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-secondary border border-border">
        <p className="text-sm text-muted-foreground">
          <FileImage className="inline h-4 w-4 mr-1" />
          <span className="font-medium text-foreground">{outputFormat.toUpperCase()}</span>
          {" - "}
          {outputFormat === "jpeg" && "Best compression with good quality. Ideal for photos."}
          {outputFormat === "png" && "Lossless compression with transparency support."}
          {outputFormat === "webp" && "Modern format. Best compression with good quality."}
          {outputFormat === "gif" && "Supports animation. Limited to 256 colors."}
          {outputFormat === "bmp" && "Uncompressed format. Large file sizes."}
        </p>
      </div>

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
                Processing...
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                Convert Images
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

export default ImageConverterTool;
