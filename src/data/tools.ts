import {
  FileText,
  Scissors,
  Minimize2,
  FileImage,
  FileType,
  Presentation,
  Table,
  Globe,
  RotateCw,
  Hash,
  Droplets,
  Crop,
  Edit3,
  Unlock,
  Lock,
  PenTool,
  EyeOff,
  GitCompare,
  FileArchive,
  Scan,
  Search,
  Image,
  Video,
  Eraser,
  Palette,
  Layers,
  ArrowRightLeft,
  FileCheck,
  Wrench,
  LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "organize"
  | "convert-to"
  | "convert-from"
  | "edit"
  | "security"
  | "image";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  isNew?: boolean;
  credits?: number;
}

export const categories: { id: ToolCategory; name: string; color: string }[] = [
  { id: "organize", name: "Organize PDF", color: "organize" },
  { id: "convert-to", name: "Convert to PDF", color: "convert-to" },
  { id: "convert-from", name: "Convert from PDF", color: "convert-from" },
  { id: "edit", name: "Edit PDF", color: "edit" },
  { id: "security", name: "PDF Security", color: "security" },
  { id: "image", name: "Image Tools", color: "image" },
];

export const tools: Tool[] = [
  // Organize PDF
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: Layers,
    category: "organize",
    credits: 5,
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: Scissors,
    category: "organize",
    credits: 5,
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    description: "Remove unwanted pages from your PDF document with ease.",
    icon: FileArchive,
    category: "organize",
    credits: 10,
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    description: "Extract specific pages from your PDF into a new document.",
    icon: FileText,
    category: "organize",
    credits: 10,
  },
  {
    id: "organize-pdf",
    name: "Organize PDF",
    description: "Sort pages of your PDF file however you like. Delete or add pages at your convenience.",
    icon: ArrowRightLeft,
    category: "organize",
    credits: 10,
  },
  {
    id: "scan-to-pdf",
    name: "Scan to PDF",
    description: "Capture document scans from your mobile device and send them instantly.",
    icon: Scan,
    category: "organize",
    credits: 10,
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: Minimize2,
    category: "organize",
    credits: 10,
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    description: "Repair a damaged PDF and recover data from corrupt PDF files.",
    icon: Wrench,
    category: "organize",
    credits: 10,
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Easily convert scanned PDF into searchable and selectable documents.",
    icon: Search,
    category: "organize",
    credits: 5,
  },

  // Convert to PDF
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: FileImage,
    category: "convert-to",
    credits: 10,
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    icon: FileType,
    category: "convert-to",
    credits: 10,
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    icon: Presentation,
    category: "convert-to",
    credits: 10,
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    icon: Table,
    category: "convert-to",
    credits: 10,
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert webpages in HTML to PDF. Copy and paste the URL and convert with a click.",
    icon: Globe,
    category: "convert-to",
    credits: 10,
  },

  // Convert from PDF
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: FileImage,
    category: "convert-from",
    credits: 10,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    icon: FileType,
    category: "convert-from",
    credits: 10,
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    icon: Presentation,
    category: "convert-from",
    credits: 10,
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    icon: Table,
    category: "convert-from",
    credits: 10,
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Transform your PDF to PDF/A, the ISO-standardized version for long-term archiving.",
    icon: FileCheck,
    category: "convert-from",
    credits: 10,
  },

  // Edit PDF
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    icon: RotateCw,
    category: "edit",
    credits: 10,
  },
  {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.",
    icon: Hash,
    category: "edit",
    credits: 10,
  },
  {
    id: "add-watermark",
    name: "Add Watermark",
    description: "Stamp an image or text over your PDF in seconds. Choose typography and transparency.",
    icon: Droplets,
    category: "edit",
    credits: 10,
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    description: "Crop margins of PDF documents or select specific areas to apply changes.",
    icon: Crop,
    category: "edit",
    isNew: true,
    credits: 10,
  },
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document.",
    icon: Edit3,
    category: "edit",
    isNew: true,
    credits: 10,
  },

  // PDF Security
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: Unlock,
    category: "security",
    credits: 10,
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    icon: Lock,
    category: "security",
    credits: 10,
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others.",
    icon: PenTool,
    category: "security",
    credits: 80,
  },
  {
    id: "redact-pdf",
    name: "Redact PDF",
    description: "Redact text and graphics to permanently remove sensitive information from a PDF.",
    icon: EyeOff,
    category: "security",
    isNew: true,
    credits: 10,
  },
  {
    id: "compare-pdf",
    name: "Compare PDF",
    description: "Show a side-by-side document comparison and easily spot changes between versions.",
    icon: GitCompare,
    category: "security",
    isNew: true,
    credits: 10,
  },

  // Image Tools
  {
    id: "image-to-text",
    name: "Image to Text",
    description: "Extract text from images using advanced OCR technology.",
    icon: FileText,
    category: "image",
    credits: 10,
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert multiple images to a single PDF document.",
    icon: FileImage,
    category: "image",
    credits: 10,
  },
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove backgrounds from images automatically with AI.",
    icon: Eraser,
    category: "image",
    credits: 10,
  },
  {
    id: "logo-editor",
    name: "Logo Editor",
    description: "Create and edit logos with our easy-to-use editor.",
    icon: Palette,
    category: "image",
    credits: 10,
  },
  {
    id: "video-editor",
    name: "Video Editor",
    description: "Edit videos with our powerful online video editor.",
    icon: Video,
    category: "image",
    credits: 20,
  },
  {
    id: "compress-image",
    name: "Compress Image",
    description: "Reduce image file size while maintaining quality.",
    icon: Minimize2,
    category: "image",
    credits: 2,
  },
  {
    id: "resize-image",
    name: "Resize Image",
    description: "Resize images to any dimension you need.",
    icon: Image,
    category: "image",
    credits: 2,
  },
  {
    id: "upscale-image",
    name: "Upscale Image",
    description: "Enhance image resolution using AI technology.",
    icon: Image,
    category: "image",
    credits: 20,
  },
];

export const getToolsByCategory = (category: ToolCategory) =>
  tools.filter((tool) => tool.category === category);

export const getToolById = (id: string) => tools.find((tool) => tool.id === id);

export const getCategoryColor = (category: ToolCategory): string => {
  const colors: Record<ToolCategory, string> = {
    organize: "bg-organize text-white",
    "convert-to": "bg-convert-to text-white",
    "convert-from": "bg-convert-from text-white",
    edit: "bg-edit text-white",
    security: "bg-security text-foreground",
    image: "bg-image text-white",
  };
  return colors[category];
};

export const getCategoryBorderColor = (category: ToolCategory): string => {
  const colors: Record<ToolCategory, string> = {
    organize: "border-organize hover:border-organize",
    "convert-to": "border-convert-to hover:border-convert-to",
    "convert-from": "border-convert-from hover:border-convert-from",
    edit: "border-edit hover:border-edit",
    security: "border-security hover:border-security",
    image: "border-image hover:border-image",
  };
  return colors[category];
};
