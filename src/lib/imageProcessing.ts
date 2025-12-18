// Browser-based image processing utilities

export interface ImageProcessingOptions {
  format?: "jpeg" | "png" | "webp" | "gif" | "bmp";
  quality?: number;
  width?: number;
  height?: number;
  scale?: number;
  maintainAspectRatio?: boolean;
}

export const loadImage = (file: File | Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const convertImage = async (
  file: File,
  options: ImageProcessingOptions
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  // Handle resize
  if (options.scale && options.scale !== 100) {
    const scaleFactor = options.scale / 100;
    targetWidth = Math.round(img.naturalWidth * scaleFactor);
    targetHeight = Math.round(img.naturalHeight * scaleFactor);
  } else if (options.width || options.height) {
    if (options.maintainAspectRatio !== false) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      if (options.width && options.height) {
        targetWidth = options.width;
        targetHeight = options.height;
      } else if (options.width) {
        targetWidth = options.width;
        targetHeight = Math.round(options.width / aspectRatio);
      } else if (options.height) {
        targetHeight = options.height;
        targetWidth = Math.round(options.height * aspectRatio);
      }
    } else {
      targetWidth = options.width || img.naturalWidth;
      targetHeight = options.height || img.naturalHeight;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const mimeType = getMimeType(options.format || "jpeg");
  const quality = (options.quality || 85) / 100;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      },
      mimeType,
      quality
    );
  });
};

export const compressImage = async (
  file: File,
  quality: number = 85
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to compress image"));
      },
      "image/jpeg",
      quality / 100
    );
  });
};

export const resizeImage = async (
  file: File,
  options: {
    width?: number;
    height?: number;
    scale?: number;
    maintainAspectRatio?: boolean;
  }
): Promise<Blob> => {
  return convertImage(file, { ...options, format: getFormatFromFile(file) as any });
};

export const cropImage = async (
  file: File,
  crop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  const format = getFormatFromFile(file);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to crop image"));
      },
      getMimeType(format)
    );
  });
};

export const rotateImage = async (
  file: File,
  degrees: number
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  canvas.width = img.naturalHeight * sin + img.naturalWidth * cos;
  canvas.height = img.naturalHeight * cos + img.naturalWidth * sin;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const format = getFormatFromFile(file);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to rotate image"));
      },
      getMimeType(format)
    );
  });
};

export const addWatermark = async (
  file: File,
  watermark: { text: string; position: string; opacity: number; fontSize: number }
): Promise<Blob> => {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  ctx.globalAlpha = watermark.opacity / 100;
  ctx.font = `${watermark.fontSize}px Arial`;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  const textMetrics = ctx.measureText(watermark.text);
  let x: number, y: number;

  switch (watermark.position) {
    case "top-left":
      x = 20;
      y = watermark.fontSize + 20;
      break;
    case "top-right":
      x = canvas.width - textMetrics.width - 20;
      y = watermark.fontSize + 20;
      break;
    case "bottom-left":
      x = 20;
      y = canvas.height - 20;
      break;
    case "bottom-right":
      x = canvas.width - textMetrics.width - 20;
      y = canvas.height - 20;
      break;
    default: // center
      x = (canvas.width - textMetrics.width) / 2;
      y = canvas.height / 2;
  }

  ctx.strokeText(watermark.text, x, y);
  ctx.fillText(watermark.text, x, y);

  const format = getFormatFromFile(file);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to add watermark"));
      },
      getMimeType(format)
    );
  });
};

const getMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
  };
  return mimeTypes[format.toLowerCase()] || "image/jpeg";
};

const getFormatFromFile = (file: File): string => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpeg";
  return ext === "jpg" ? "jpeg" : ext;
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
