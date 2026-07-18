"use client";
import React, { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
  status: 'draft' | 'published';
  date: string;
}

// Initial Mock Telemetry Data matching our SQL Schema definitions
const initialBlogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "Unbundling the Monolith: The Power of $5 Micro-Nodes",
    slug: "unbundling-monolith-micro-nodes",
    summary: "Why traditional SaaS suites fail consumer scalability metrics and how single-purpose engines maximize corporate margins.",
    content: "The modern software ecosystem has reached peak bloat. By isolating functional logic units into decentralized micro-nodes, enterprises strip architectural overhead down to net zero...",
    metaTitle: "Unbundling SaaS with Micro-Nodes | Abyss Systems",
    metaDesc: "Discover the efficiency metrics behind single-feature utility architectures and how to bypass multi-tenant bloat.",
    status: "published",
    date: "July 2026"
  },
  {
    id: "blog-2",
    title: "Optimizing Core Web Vitals via Edge-Rendered Layers",
    slug: "optimizing-core-web-vitals-edge",
    summary: "Deep technical breakdown of caching matrices, hydration speeds, and lighthouse performance optimization.",
    content: "Hydration speed is the ultimate conversion gatekeeper. Rendering UI maps directly at global edge cluster topologies drops total document interactive deltas down below 120ms...",
    metaTitle: "Edge Rendering & Core Web Vitals Optimization",
    metaDesc: "A masterclass on optimizing frontend cache validation cycles to maintain 100% lighthouse metric passes.",
    status: "draft",
    date: "Pending Sync"
  }
];

export default function BlogBuilderDashboard(): React.JSX.Element {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [activeTab, setActiveTab] = useState<"directory" | "wizard">("directory");

  // Multi-Step Content Wizard State Matrices
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSummary, setNewSummary] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newMetaTitle, setNewMetaTitle] = useState<string>('');
  const [newMetaDesc, setNewMetaDesc] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'draft' | 'published'>('draft');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  // Auto-generate URL slugs from title inputs dynamically
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // ----------------------------------------------------
  // Directory Mutation Actions
  // ----------------------------------------------------
  const handleToggleStatus = (id: string) => {
    setBlogs(blogs.map(blog => 
      blog.id === id 
        ? { ...blog, status: blog.status === 'published' ? 'draft' : 'published' } 
        : blog
    ));
  };

  const handlePurgeBlog = (id: string) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  // ----------------------------------------------------
  // Wizard Pipeline Operations
  // ----------------------------------------------------
  const triggerCompilationSequence = () => {
    setIsCompiling(true);
    
    setTimeout(() => {
      const finalizedNode: BlogPost = {
        id: `blog-${Date.now()}`,
        title: newTitle,
        slug: generateSlug(newTitle),
        summary: newSummary,
        content: newContent,
        metaTitle: newMetaTitle || `${newTitle} | Abyss Core`,
        metaDesc: newMetaDesc || newSummary.substring(0, 155),
        status: newStatus,
        date: newStatus === 'published' ? 'Just Now' : 'Pending Deployment'
      };

      setBlogs([finalizedNode, ...blogs]);
      setIsCompiling(false);
      setWizardStep(5); // Advance to Success Screen Terminal
    }, 1800);
  };

  const resetWizardState = () => {
    setWizardStep(1);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewMetaTitle('');
    setNewMetaDesc('');
    setNewStatus('draft');
    setActiveTab("directory");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Central Module Controls Toolbar Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// MODULE :: BLOG_BUILDER</span>
          <h2 className="text-2xl font-black text-white uppercase italic mt-1">Content Deployment Engine</h2>
        </div>

        <div className="flex bg-[#4B5563] p-1 border border-gray-500/20 rounded-xl gap-1">
          <button 
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'directory' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Article Directory
          </button>
          <button 
            onClick={() => setActiveTab("wizard")}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'wizard' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Launch Builder Wizard
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          VIEW 1: ARTICLE DIRECTORY CONTROL LIST
      ---------------------------------------------------- */}
      {activeTab === "directory" && (
        <section className="space-y-4">
          {blogs.length === 0 ? (
            <div className="text-center py-12 bg-[#374151]/40 border border-gray-500/20 rounded-2xl text-xs font-mono text-gray-400">
              NO ACTIVE CONTENT NODES LOCATED IN STORAGE MATRICES.
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-400 transition duration-300 group">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase border ${
                      blog.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      • {blog.status}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">Published: {blog.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase italic tracking-wide group-hover:text-[#00F2FE] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 bg-[#4B5563]/20 border border-gray-500/10 p-3 rounded-xl max-w-3xl">
                    {blog.summary}
                  </p>
                  
                  <div className="text-[10px] font-mono text-gray-400 pt-1">
                    URL Slug Reference: <span className="text-[#00F2FE]">/blog/{blog.slug}</span>
                  </div>
                </div>

                {/* Dashboard Operations Panel */}
                <div className="flex md:flex-col gap-2 min-w-[140px]">
                  <button
                    onClick={() => handleToggleStatus(blog.id)}
                    className={`w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      blog.status === 'published'
                        ? 'border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-gray-900'
                        : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-gray-900'
                    }`}
                  >
                    {blog.status === 'published' ? "Revert to Draft" : "Push Live"}
                  </button>
                  <button
                    onClick={() => handlePurgeBlog(blog.id)}
                    className="w-full py-2 bg-transparent border border-gray-500/40 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Purge Engine
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* ----------------------------------------------------
          VIEW 2: MULTI-STEP CREATION WIZARD ENGINE
      ---------------------------------------------------- */}
      {activeTab === "wizard" && (
        <section className="bg-[#374151] border border-gray-500/40 p-8 rounded-3xl shadow-xl min-h-[460px] flex flex-col justify-between">
          
          <div>
            {/* Wizard Telemetry Tracker */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic">Structured Copy Provisioning Wizard</h3>
                <p className="text-xs text-gray-300 mt-0.5">Automated framework steps to build cache-optimized marketing posts.</p>
              </div>
              {wizardStep <= 4 && (
                <span className="font-mono text-xs font-black text-[#00F2FE] bg-[#4B5563] px-3 py-1 rounded border border-gray-500/20 shadow-inner">
                  PIPELINE {wizardStep} / 4
                </span>
              )}
            </div>

            {/* Dynamic Loading Step Tracker Visual */}
            {wizardStep <= 4 && (
              <div className="w-full bg-[#4B5563] h-1.5 rounded-full mb-8 overflow-hidden">
                <div 
                  className="bg-[#00F2FE] h-full transition-all duration-500 shadow-[0_0_10px_#00F2FE]" 
                  style={{ width: `${(wizardStep / 4) * 100}%` }}
                />
              </div>
            )}

            {/* STEP 1: Core Meta Content Identifiers */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Article Title Concept String</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Scaling POS Vector Queries in Record Environments"
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                  />
                  {newTitle && (
                    <span className="text-[10px] font-mono text-gray-400 block mt-1">
                      Computed URL Parameter Target: <span className="text-[#00F2FE]">/blog/{generateSlug(newTitle)}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Summary Context Blurb (Teaser Hook)</label>
                  <input 
                    type="text"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Provide a high-conversion micro summary paragraph describing your technical blueprint..."
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Ingestion Text Processing */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Core Content Markdown Buffer</label>
                  <textarea 
                    rows={6}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste layout logs or composition string details here..."
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE] resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SEO Optimization Parameter Matrix */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Meta Title Tag (Google Title)</label>
                    <span className="text-[9px] font-mono text-gray-400">{newMetaTitle.length} / 60 max</span>
                  </div>
                  <input 
                    type="text"
                    maxLength={60}
                    value={newMetaTitle}
                    onChange={(e) => setNewMetaTitle(e.target.value)}
                    placeholder={newTitle ? `${newTitle} | Abyss Core` : "Leave empty to inherit standard layout configuration"}
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Meta Description Hook (Snippet Field)</label>
                    <span className="text-[9px] font-mono text-gray-400">{newMetaDesc.length} / 160 max</span>
                  </div>
                  <input 
                    type="text"
                    maxLength={160}
                    value={newMetaDesc}
                    onChange={(e) => setNewMetaDesc(e.target.value)}
                    placeholder={newSummary ? newSummary.substring(0, 150) + "..." : "Provide clear query descriptions to hook organic crawls"}
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Absolute Build Verification Review */}
            {wizardStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs uppercase tracking-wider font-bold text-gray-300 font-mono">// System Registry Preview Manifest</p>
                
                <div className="bg-[#4B5563]/40 border border-gray-500/30 p-5 rounded-2xl space-y-4 text-xs">
                  <div className="grid grid-cols-3 border-b border-gray-500/20 pb-2">
                    <span className="text-gray-400 uppercase font-mono text-[10px]">Title Vector</span>
                    <span className="col-span-2 font-bold text-white italic">{newTitle}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-gray-500/20 pb-2">
                    <span className="text-gray-400 uppercase font-mono text-[10px]">Google Meta Title</span>
                    <span className="col-span-2 text-[#00F2FE] font-mono">{newMetaTitle || `${newTitle} | Abyss Systems`}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-gray-400 uppercase font-mono text-[10px]">Deployment State</span>
                    <span className="col-span-2 flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setNewStatus('draft')}
                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${newStatus === 'draft' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'border-gray-500 text-gray-400'}`}
                      >
                        Keep Draft
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setNewStatus('published')}
                        className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${newStatus === 'published' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'border-gray-500 text-gray-400'}`}
                      >
                        Publish Instantly
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Success Output Screen */}
            {wizardStep === 5 && (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="mx-auto w-12 h-12 bg-cyan-500/10 border border-[#00F2FE] text-[#00F2FE] text-glow rounded-full flex items-center justify-center text-xl font-bold animate-bounce">
                  ✓
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight italic">Content Protocol Compiled</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto">The article entity node structure has been integrated flawlessly into your global routing matrix.</p>
              </div>
            )}
          </div>

          {/* Wizard Navigation Framework Controls Footer */}
          {wizardStep <= 4 && (
            <div className="flex gap-4 pt-8 border-t border-gray-500/20 mt-8">
              {wizardStep > 1 && (
                <button 
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="w-1/4 py-3 border border-gray-500/40 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all focus:outline-none"
                >
                  Back
                </button>
              )}
              
              <button 
                onClick={() => {
                  if (wizardStep < 4) setWizardStep(wizardStep + 1);
                  else triggerCompilationSequence();
                }}
                disabled={
                  (wizardStep === 1 && (!newTitle.trim() || !newSummary.trim())) ||
                  (wizardStep === 2 && !newContent.trim()) ||
                  isCompiling
                }
                className={`py-3 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all focus:outline-none disabled:opacity-45 disabled:cursor-not-allowed ${
                  wizardStep === 1 ? 'w-full' : 'w-3/4'
                }`}
              >
                {isCompiling 
                  ? "Writing Memory Allocation Clusters..." 
                  : wizardStep === 4 
                    ? newStatus === 'published' ? "Deploy Code Live" : "Save Matrix Frame" 
                    : "Next Matrix Stage"
                }
              </button>
            </div>
          )}

          {wizardStep === 5 && (
            <button 
              onClick={resetWizardState}
              className="w-full mt-8 py-3 bg-[#4B5563] border border-gray-500/40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-gray-600 focus:outline-none"
            >
              Return to Module Dashboard
            </button>
          )}

        </section>
      )}

    </div>
  );
}