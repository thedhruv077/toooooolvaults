
import React, { useState } from "react";
import { Search, FileText, Copy, CheckCircle2 } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const SEOTools = () => {
  const [activeTab, setActiveTab] = useState<"meta" | "keyword">("meta");
  const [title, setTitle] = useState("My Website Title");
  const [description, setDescription] = useState("Engaging content about digital tools and resources.");
  const [keywords, setKeywords] = useState("tools, utilities, calculators, digital resources");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate meta tags on component mount
  React.useEffect(() => {
    if (activeTab === "meta") {
      generateMetaTags();
    } else {
      analyzeKeywords();
    }
  }, [activeTab]);

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

    let analysisText = `# Keyword Analysis for Your Content\n\n`;
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

      analysisText += `\n## How to Use These Keywords\n\n`;
      analysisText += `1. Include these keywords in your page title, headings, and first paragraph\n`;
      analysisText += `2. Aim for a keyword density of 1-2% in your content\n`;
      analysisText += `3. Use variations of these keywords throughout your content\n`;
      analysisText += `4. Include these keywords in your meta description and image alt tags\n`;
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
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>SEO Tools - Generate Meta Tags & Analyze Keywords | Tool Vault</title>
        <meta name="description" content="Free SEO tools to generate meta tags and analyze keywords for better search engine visibility." />
        <meta name="keywords" content="SEO tools, meta tag generator, keyword analyzer, SEO optimization, search engine optimization" />
      </Helmet>
      
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
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
                  <h2 className="text-lg font-medium mb-4">Optimize Your SEO</h2>
                  <p className="text-foreground/70 mb-4">
                    Generate meta tags to improve your website's visibility in search engines and social media platforms.
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Website Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setTimeout(generateMetaTags, 500);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="Enter your website title"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setTimeout(generateMetaTags, 500);
                      }}
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
                      onChange={(e) => {
                        setKeywords(e.target.value);
                        setTimeout(generateMetaTags, 500);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h2 className="text-lg font-medium mb-4">Keyword Analysis</h2>
                  <p className="text-foreground/70 mb-4">
                    Analyze your keywords to optimize your content for search engines.
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Keywords (comma separated)
                    </label>
                    <textarea
                      value={keywords}
                      onChange={(e) => {
                        setKeywords(e.target.value);
                        setTimeout(analyzeKeywords, 500);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all min-h-[120px]"
                      placeholder="Enter keywords to analyze (comma separated)"
                    />
                  </div>
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
      
      <Footer />
    </div>
  );
};

export default SEOTools;
