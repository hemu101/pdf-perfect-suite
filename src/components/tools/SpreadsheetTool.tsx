import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Loader2, Table, Sparkles, Calculator, X } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";

type TabType = "viewer" | "formula" | "ai";

const SpreadsheetTool = () => {
  const { user } = useAuth();
  const { credits, deductCredits } = useCredits();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>("viewer");
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [formula, setFormula] = useState("");
  const [formulaResult, setFormulaResult] = useState<string>("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
      
      setData(jsonData as string[][]);
      setFileName(file.name);
      toast.success(`Loaded ${file.name}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to parse file");
    }
  };

  const downloadData = () => {
    if (data.length === 0) return;
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `edited_${fileName || 'data.xlsx'}`);
    toast.success("File downloaded");
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    setData(prev => {
      const newData = [...prev];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = value;
      return newData;
    });
  };

  const addRow = () => {
    const cols = data[0]?.length || 3;
    setData(prev => [...prev, Array(cols).fill("")]);
  };

  const addColumn = () => {
    setData(prev => prev.map(row => [...row, ""]));
  };

  // Formula calculator
  const formulas: Record<string, { desc: string; example: string }> = {
    SUM: { desc: "Add numbers", example: "SUM(1, 2, 3, 4)" },
    AVERAGE: { desc: "Calculate average", example: "AVERAGE(10, 20, 30)" },
    MAX: { desc: "Find maximum", example: "MAX(5, 10, 15)" },
    MIN: { desc: "Find minimum", example: "MIN(5, 10, 15)" },
    COUNT: { desc: "Count values", example: "COUNT(1, 2, '', 4)" },
    ROUND: { desc: "Round number", example: "ROUND(3.14159, 2)" },
    ABS: { desc: "Absolute value", example: "ABS(-42)" },
    POWER: { desc: "Raise to power", example: "POWER(2, 8)" },
    SQRT: { desc: "Square root", example: "SQRT(144)" },
    CONCAT: { desc: "Join text", example: "CONCAT('Hello', ' ', 'World')" },
    UPPER: { desc: "Uppercase", example: "UPPER('hello')" },
    LOWER: { desc: "Lowercase", example: "LOWER('HELLO')" },
    LEN: { desc: "Text length", example: "LEN('Hello World')" },
    IF: { desc: "Conditional", example: "IF(10 > 5, 'Yes', 'No')" },
    VLOOKUP: { desc: "Vertical lookup", example: "VLOOKUP(2, [[1,'A'],[2,'B']], 2)" },
  };

  const executeFormula = () => {
    try {
      // Parse and execute formula
      const formulaMatch = formula.match(/^(\w+)\((.*)\)$/);
      if (!formulaMatch) {
        setFormulaResult("Invalid formula format");
        return;
      }

      const [, funcName, args] = formulaMatch;
      const parsedArgs = eval(`[${args}]`);

      let result: string | number;
      switch (funcName.toUpperCase()) {
        case 'SUM':
          result = parsedArgs.reduce((a: number, b: number) => Number(a) + Number(b), 0);
          break;
        case 'AVERAGE':
          result = parsedArgs.reduce((a: number, b: number) => a + b, 0) / parsedArgs.length;
          break;
        case 'MAX':
          result = Math.max(...parsedArgs);
          break;
        case 'MIN':
          result = Math.min(...parsedArgs);
          break;
        case 'COUNT':
          result = parsedArgs.filter((x: unknown) => x !== '' && x !== null && x !== undefined).length;
          break;
        case 'ROUND':
          result = Number(parsedArgs[0]).toFixed(parsedArgs[1] || 0);
          break;
        case 'ABS':
          result = Math.abs(parsedArgs[0]);
          break;
        case 'POWER':
          result = Math.pow(parsedArgs[0], parsedArgs[1]);
          break;
        case 'SQRT':
          result = Math.sqrt(parsedArgs[0]);
          break;
        case 'CONCAT':
          result = parsedArgs.join('');
          break;
        case 'UPPER':
          result = String(parsedArgs[0]).toUpperCase();
          break;
        case 'LOWER':
          result = String(parsedArgs[0]).toLowerCase();
          break;
        case 'LEN':
          result = String(parsedArgs[0]).length;
          break;
        case 'IF':
          result = parsedArgs[0] ? parsedArgs[1] : parsedArgs[2];
          break;
        case 'VLOOKUP':
          const [searchVal, table, colIndex] = parsedArgs;
          const found = table.find((row: unknown[]) => row[0] === searchVal);
          result = found ? found[colIndex - 1] : '#N/A';
          break;
        default:
          result = 'Unknown formula';
      }

      setFormulaResult(String(result));
      toast.success("Formula executed");
    } catch (error) {
      console.error(error);
      setFormulaResult("Error: Invalid formula");
    }
  };

  // AI Processing
  const processWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    const creditsNeeded = 10;
    if (user && credits && credits.balance < creditsNeeded) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    setAiResult("");

    try {
      const response = await supabase.functions.invoke("ai-spreadsheet", {
        body: {
          prompt: aiPrompt,
          data: data.length > 0 ? data : null
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setAiResult(response.data.result);

      if (user) {
        await deductCredits(creditsNeeded, "ai-spreadsheet", "AI spreadsheet processing");
      }

      toast.success("AI processing complete");
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error.message?.includes("402")) {
        toast.error("Please add credits to continue using AI features.");
      } else {
        toast.error("AI processing failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "viewer" as TabType, name: "Viewer & Editor", icon: Table },
    { id: "formula" as TabType, name: "Formula Calculator", icon: Calculator },
    { id: "ai" as TabType, name: "AI Processing", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Viewer Tab */}
      {activeTab === "viewer" && (
        <div className="space-y-4">
          {/* Upload */}
          <div
            className={`rounded-2xl border-2 border-dashed p-6 transition-all ${
              isDragging ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                Drag & drop CSV/Excel file or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
            </div>
          </div>

          {/* Data Table */}
          {data.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {fileName} - {data.length} rows × {data[0]?.length || 0} columns
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addRow}>Add Row</Button>
                  <Button variant="outline" size="sm" onClick={addColumn}>Add Column</Button>
                  <Button variant="outline" size="sm" onClick={downloadData}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="overflow-auto max-h-[400px] border border-border rounded-lg">
                <table className="w-full text-sm">
                  <tbody>
                    {data.slice(0, 100).map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex === 0 ? "bg-secondary font-medium" : ""}>
                        <td className="border-r border-border bg-secondary px-2 py-1 text-center text-muted-foreground">
                          {rowIndex + 1}
                        </td>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border-r border-b border-border p-0">
                            <input
                              type="text"
                              value={cell || ""}
                              onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                              className="w-full px-2 py-1 bg-transparent focus:bg-primary/5 outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length > 100 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing first 100 rows of {data.length}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Formula Tab */}
      {activeTab === "formula" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Formula Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-medium">Enter Formula</label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  placeholder="SUM(1, 2, 3, 4)"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <Button variant="hero" onClick={executeFormula}>
                <Calculator className="h-4 w-4" />
                Calculate
              </Button>
              {formulaResult && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground">Result:</p>
                  <p className="text-2xl font-bold text-green-500">{formulaResult}</p>
                </div>
              )}
            </div>

            {/* Formula Reference */}
            <div className="space-y-2">
              <h3 className="font-medium">Available Formulas</h3>
              <div className="max-h-[300px] overflow-auto space-y-2">
                {Object.entries(formulas).map(([name, { desc, example }]) => (
                  <div
                    key={name}
                    className="p-3 rounded-lg bg-secondary border border-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setFormula(example)}
                  >
                    <p className="font-mono font-medium text-primary">{name}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ex: {example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Tab */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">AI-Powered Processing</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Describe what you want to do with your data. AI will analyze and process it automatically.
            </p>
          </div>

          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="E.g., 'Calculate the total sales by region', 'Find all entries where amount is greater than 1000', 'Create a summary report of this data', 'Convert all dates to YYYY-MM-DD format'"
            rows={4}
          />

          <Button
            variant="hero"
            onClick={processWithAI}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Process with AI
              </>
            )}
          </Button>

          {aiResult && (
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <h4 className="font-medium mb-2">AI Result:</h4>
              <div className="whitespace-pre-wrap text-sm">{aiResult}</div>
            </div>
          )}

          {data.length > 0 && (
            <p className="text-sm text-muted-foreground">
              AI has access to your loaded spreadsheet data ({data.length} rows).
            </p>
          )}

          {user && credits && (
            <div className="p-3 rounded-lg bg-secondary border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">10 credits</span> per AI request.
                Balance: <span className="text-primary font-medium">{credits.balance}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpreadsheetTool;
