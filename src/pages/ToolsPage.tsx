import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { categories, getToolsByCategory, tools, ToolCategory } from "@/data/tools";
import { cn } from "@/lib/utils";

const ToolsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as ToolCategory | null;
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(
    categoryParam || "all"
  );

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (category: ToolCategory | "all") => {
    setActiveCategory(category);
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const displayedTools =
    activeCategory === "all" ? tools : getToolsByCategory(activeCategory);

  const getCategoryColorClass = (category: ToolCategory | "all", isActive: boolean) => {
    if (!isActive) return "";
    if (category === "all") return "bg-primary text-primary-foreground hover:bg-primary";
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20 bg-gradient-hero">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground md:text-5xl mb-4">
              All PDF & Image Tools
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to edit, convert, and manage your documents.
              Select a category or browse all tools.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "transition-all duration-200",
                getCategoryColorClass("all", activeCategory === "all")
              )}
            >
              All Tools
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "transition-all duration-200",
                  getCategoryColorClass(category.id, activeCategory === category.id)
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Tools Count */}
          <p className="text-center text-muted-foreground mb-8">
            Showing {displayedTools.length} tool
            {displayedTools.length !== 1 ? "s" : ""}
          </p>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsPage;
