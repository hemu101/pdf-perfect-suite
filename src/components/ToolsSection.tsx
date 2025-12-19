import { useState } from "react";
import { categories, getToolsByCategory, ToolCategory } from "@/data/tools";
import ToolCard from "./ToolCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ToolsSection = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("organize");

  const tools = getToolsByCategory(activeCategory);

  const getCategoryColorClass = (category: ToolCategory, isActive: boolean) => {
    if (!isActive) return "";
    const colors: Record<ToolCategory, string> = {
      organize: "bg-organize text-white hover:bg-organize",
      "convert-to": "bg-convert-to text-white hover:bg-convert-to",
      "convert-from": "bg-convert-from text-white hover:bg-convert-from",
      edit: "bg-edit text-white hover:bg-edit",
      security: "bg-security text-foreground hover:bg-security",
      image: "bg-image text-white hover:bg-image",
      spreadsheet: "bg-primary text-primary-foreground hover:bg-primary",
    };
    return colors[category];
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
            All the tools you'll ever need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access our full suite of PDF and image editing tools. Everything is
            100% free and easy to use.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "transition-all duration-200",
                getCategoryColorClass(category.id, activeCategory === category.id)
              )}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
