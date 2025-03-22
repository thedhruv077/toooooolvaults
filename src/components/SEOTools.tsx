
import React, { useState } from "react";
import { Search, FileText, Copy, CheckCircle2 } from "lucide-react";

const SEOTools = () => {
  const [activeTab, setActiveTab] = useState<"meta" | "keyword">("meta");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateMetaTags = () => {
    if (!title.trim()) return;

    const metaTitle = `<meta name="title" content="${title}">`;
    const metaDescription = description.trim()
      ? `<meta name="description" content="${description}">`
      : "";
    const metaKeywords = keywords.trim()
      ? `<meta name="keywords" content="${keywords}">`
      : "";

    const code = `<!-- Primary Meta Tags -->
${metaTitle}
${metaDescription}
${metaKeywords}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
${
  description.trim()
    ? `<meta property="og:description" content="${description}">`
    : ""
}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
${
  description.trim()
    ? `<meta property="twitter:description" content="${description}">`
    : ""
}`;

    setGeneratedCode(code);
  };

  const analyzeKeywords = () => {
    if (!keywords.trim()) return;

    const keywordList = keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);

    let analysisText = `# Keyword Analysis\n\n`;
    analysisText += `Total Keywords: ${keywordList.length}\n\n`;

    if (keywordList.length > 0) {
      analysisText += `## Keyword Density\n\n`;
      
      // Simple keyword density analysis
      const keywordCounts: Record<string, number> = {};
      const totalWords = keywordList.reduce((count, keyword) => {
        const words = keyword.split(" ");
        return count + words.length;
      }, 0);
      
      keywordList.forEach((keyword) => {
        const wordCount = keyword.split(" ").length;
        keywordCounts[keyword] = wordCount;
      });
      
      analysisText += `Total Words: ${totalWords}\n\n`;
      analysisText += `## Keywords by Length\n\n`;
      
      Object.entries(keywordCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([keyword, count]) => {
          analysisText += `- "${keyword}" (${count} word${count > 1 ? "s" : ""})\n`;
        });
    }

    setGeneratedCode(analysisText);
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
          <div className="border-b border-border/50 p-6 flex items-center gap-3">
            <Search className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-semibold">SEO Tools</h1>
          </div>

          <div className="border-b border-border/50">
            <div className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === "meta"
                    ? "border-b-2 border-accent"
                    : "text-foreground/60 hover:text-foreground"
                }`}
                onClick={() => setActiveTab("meta")}
              >
                Meta Tag Generator
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === "keyword"
                    ? "border-b-2 border-accent"
                    : "text-foreground/60 hover:text-foreground"
                }`}
                onClick={() => setActiveTab("keyword")}
              >
                Keyword Research
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "meta" ? (
              <div className="animate-fade-in">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="Enter page title"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all min-h-[100px]"
                    placeholder="Enter meta description"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <button
                  onClick={generateMetaTags}
                  className="w-full py-3 rounded-lg bg-accent text-white font-medium transition-all duration-300 hover:bg-accent/90 hover:shadow-lg active:scale-95"
                >
                  Generate Meta Tags
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Keywords (comma separated)
                  </label>
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all min-h-[120px]"
                    placeholder="Enter keywords to analyze (comma separated)"
                  />
                </div>

                <button
                  onClick={analyzeKeywords}
                  className="w-full py-3 rounded-lg bg-accent text-white font-medium transition-all duration-300 hover:bg-accent/90 hover:shadow-lg active:scale-95"
                >
                  Analyze Keywords
                </button>
              </div>
            )}

            {generatedCode && (
              <div className="mt-8 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Generated Output</h2>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-md glass-panel glass-panel-dark border border-border/50 transition-all hover:bg-accent/10"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-lg glass-panel glass-panel-dark border border-border/50 overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap">{generatedCode}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOTools;
