import { Link } from "react-router-dom";
import { Tool, getCategoryColor, getCategoryBorderColor } from "@/data/tools";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

const ToolCard = ({ tool, index = 0 }: ToolCardProps) => {
  const Icon = tool.icon;

  return (
    <Link
      to={`/tool/${tool.id}`}
      className={`group relative flex flex-col p-6 rounded-xl border-2 border-border bg-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${getCategoryBorderColor(tool.category)} animate-slide-up opacity-0`}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
    >
      {tool.isNew && (
        <Badge className="absolute -top-2 -right-2 bg-gradient-primary text-primary-foreground border-0">
          New
        </Badge>
      )}

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${getCategoryColor(tool.category)} shadow-md mb-4 transition-transform group-hover:scale-110`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {tool.name}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
        {tool.description}
      </p>

      {tool.credits && (
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {tool.credits} credits per file
          </span>
        </div>
      )}
    </Link>
  );
};

export default ToolCard;
