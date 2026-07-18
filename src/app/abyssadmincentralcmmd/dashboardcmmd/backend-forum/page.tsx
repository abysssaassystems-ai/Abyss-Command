"use client";
import React, { useState } from 'react';

interface ForumComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  type: 'community' | 'announcement';
  timestamp: string;
  comments: ForumComment[];
}

// Initial Mock Telemetry Data matching our schema blueprint
const initialPosts: ForumPost[] = [
  {
    id: "post-1",
    title: "Node Integration Delays with Legacy POS Nodes",
    author: "DevUser_402",
    content: "Is anyone else experiencing handshake spikes when tracking data points out of standard POS configurations? The webhook pipeline is registering a 120ms delta variance.",
    type: "community",
    timestamp: "2 hours ago",
    comments: [
      { id: "c-1", author: "Abyss_Support_Node", content: "Check your AES-256 vault configurations. Legacy frames occasionally reject fast hydration speeds.", timestamp: "1 hour ago" }
    ]
  },
  {
    id: "post-2",
    title: "⚡ SYSTEM UPGRADE: PLATFORM KERNEL VERSION 2.4 ACTIVE",
    author: "ROOT_ADMINISTRATOR",
    content: "All edge routing units have been forcefully upgraded to version 2.4. Core Web Vital optimization clusters now feature optimized asset caching models natively.",
    type: "announcement",
    timestamp: "1 day ago",
    comments: []
  }
];

export default function BackendForumDashboard(): React.JSX.Element {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<"stream" | "announcement" | "poll">("stream");

  // Local state controls for inline commenting
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Local state controls for broadcasting announcements
  const [announcementTitle, setAnnouncementTitle] = useState<string>('');
  const [announcementBody, setAnnouncementBody] = useState<string>('');

  // Poll Wizard System States
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [pollQuestion, setPollQuestion] = useState<string>('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [isPollDeploying, setIsPollDeploying] = useState<boolean>(false);

  // ----------------------------------------------------
  // Action Core Modules
  // ----------------------------------------------------
  
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleAddComment = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c-${Date.now()}`,
              author: "ADMIN_NODE_ALPHA",
              content: replyText,
              timestamp: "Just now"
            }
          ]
        };
      }
      return post;
    }));

    setReplyText('');
    setActiveReplyPostId(null);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementBody) return;

    const newAnnouncement: ForumPost = {
      id: `post-${Date.now()}`,
      title: `⚡ OFFICIAL: ${announcementTitle.toUpperCase()}`,
      author: "ROOT_ADMINISTRATOR",
      content: announcementBody,
      type: "announcement",
      timestamp: "Just now",
      comments: []
    };

    setPosts([newAnnouncement, ...posts]);
    setAnnouncementTitle('');
    setAnnouncementBody('');
    setActiveTab("stream"); // Redirect back to community stream view
  };

  // Poll Wizard Array Operations
  const handleUpdateOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleAddOptionField = () => {
    if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
  };

  const triggerPollDeployment = () => {
    setIsPollDeploying(true);
    setTimeout(() => {
      setIsPollDeploying(false);
      setWizardStep(4);
    }, 1500);
  };

  const handleResetWizard = () => {
    setPollQuestion('');
    setPollOptions(['', '']);
    setWizardStep(1);
    setActiveTab("stream");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Dynamic Navigation Toolbar Switcher */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// MODULE :: FORUM_CORE</span>
          <h2 className="text-2xl font-black text-white uppercase italic mt-1">Community Control Dashboard</h2>
        </div>

        <div className="flex bg-[#4B5563] p-1 border border-gray-500/20 rounded-xl gap-1">
          <button 
            onClick={() => setActiveTab("stream")}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'stream' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Manage Stream
          </button>
          <button 
            onClick={() => setActiveTab("announcement")}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'announcement' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Broadcast Node
          </button>
          <button 
            onClick={() => setActiveTab("poll")}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${activeTab === 'poll' ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' : 'text-gray-300 hover:text-white'}`}
          >
            Poll Wizard
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          VIEW 1: MANAGE COMMUNITY STREAM
      ---------------------------------------------------- */}
      {activeTab === "stream" && (
        <section className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-[#374151]/40 border border-gray-500/20 rounded-2xl text-xs font-mono text-gray-400">
              NO ACTIVE DATA ROW POSTS FOUND IN DATABASE.
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                className={`bg-[#374151] border p-6 rounded-3xl shadow-md transition-all flex flex-col justify-between gap-4 ${
                  post.type === 'announcement' ? 'border-[#00F2FE]/40 shadow-[0_0_15px_rgba(0,242,254,0.05)]' : 'border-gray-500/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start border-b border-gray-500/20 pb-3">
                    <div className="space-y-1">
                      <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                        post.type === 'announcement' ? 'bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20' : 'bg-[#4B5563] text-gray-300'
                      }`}>
                        {post.type}
                      </span>
                      <h3 className="text-lg font-bold text-white uppercase italic mt-2 tracking-wide">{post.title}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{post.timestamp} by <strong className="text-gray-200">{post.author}</strong></span>
                  </div>

                  <p className="text-xs text-gray-200 leading-relaxed mt-4 bg-[#4B5563]/20 border border-gray-500/10 p-4 rounded-xl">
                    {post.content}
                  </p>
                </div>

                {/* Sub-Replies Layer Mapping */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 mt-2 pl-4 border-l-2 border-gray-500/30">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-[#4B5563]/40 border border-gray-500/20 p-3 rounded-xl text-xs">
                        <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                          <span className="font-bold text-[#00F2FE]">{comment.author}</span>
                          <span>{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-200">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Footers */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-500/20">
                  <button 
                    onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                    className="text-[10px] font-mono font-bold text-[#00F2FE] hover:text-white uppercase tracking-wider focus:outline-none"
                  >
                    {activeReplyPostId === post.id ? "Cancel Reply" : "💬 Add Response Node"}
                  </button>

                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="text-[10px] font-mono font-bold text-rose-400 hover:text-rose-500 uppercase tracking-wider focus:outline-none"
                  >
                    🗑️ Purge Post
                  </button>
                </div>

                {/* Inline Comment Form Element */}
                {activeReplyPostId === post.id && (
                  <div className="mt-2 bg-[#4B5563]/30 border border-gray-500/20 p-4 rounded-2xl flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-[9px] font-mono font-bold uppercase text-gray-400">Response Configuration Data</label>
                      <input 
                        type="text" 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Provide message string entry..."
                        className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="bg-[#00F2FE] text-gray-900 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-[#00B8C4] focus:outline-none"
                    >
                      Inject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {/* ----------------------------------------------------
          VIEW 2: CREATE OFFICIAL ANNOUNCEMENT
      ---------------------------------------------------- */}
      {activeTab === "announcement" && (
        <section className="bg-[#374151] border border-gray-500/40 p-8 rounded-3xl shadow-xl">
          <div className="mb-6">
            <h3 className="text-xl font-black text-white uppercase italic">Broadcast System Announcement</h3>
            <p className="text-xs text-gray-300 mt-0.5">Dispatches a high-priority structural banner statement directly into the network stream headers.</p>
          </div>

          <form onSubmit={handleBroadcastAnnouncement} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Announcement Headline Context</label>
              <input 
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g., Scheduled Platform Core Maintenance Window"
                className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Body Ingestion Content</label>
              <textarea 
                rows={5}
                value={announcementBody}
                onChange={(e) => setAnnouncementBody(e.target.value)}
                placeholder="Write operational statement updates here..."
                className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE] resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={!announcementTitle || !announcementBody}
              className="px-6 py-3.5 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Broadcast Global Array Node
            </button>
          </form>
        </section>
      )}

      {/* ----------------------------------------------------
          VIEW 3: FORUM POLL WIZARD ENGINE
      ---------------------------------------------------- */}
      {activeTab === "poll" && (
        <section className="bg-[#374151] border border-gray-500/40 p-8 rounded-3xl shadow-xl relative min-h-[400px] flex flex-col justify-between">
          
          {/* Wizard Header Progress Node */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic">Consensus Poll Provisioning System</h3>
                <p className="text-xs text-gray-300 mt-0.5">Step-by-step framework to scale platform inquiry configurations.</p>
              </div>
              <span className="font-mono text-xs font-black text-[#00F2FE] bg-[#4B5563] px-3 py-1 rounded border border-gray-500/20 shadow-inner">
                STAGE {wizardStep} / 3
              </span>
            </div>

            <div className="w-full bg-[#4B5563] h-1.5 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-[#00F2FE] h-full transition-all duration-500 shadow-[0_0_10px_#00F2FE]" 
                style={{ width: `${(Math.min(wizardStep, 3) / 3) * 100}%` }}
              />
            </div>

            {/* STEP 1: Core Target Query Identification */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Primary Core Poll Invariant Question</label>
                  <input 
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="e.g., Should we deprecate 3G device node tracking interfaces?"
                    className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Response Option Matrix Allocation */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Response Path Options (Max 5)</label>
                  {pollOptions.length < 5 && (
                    <button 
                      onClick={handleAddOptionField}
                      className="text-[10px] font-mono font-bold text-[#00F2FE] hover:text-white transition focus:outline-none"
                    >
                      + Add Option Metric
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {pollOptions.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-400 w-4">{idx + 1}.</span>
                      <input 
                        type="text"
                        value={option}
                        onChange={(e) => handleUpdateOption(idx, e.target.value)}
                        placeholder={`Option alternative logic configuration value ${idx + 1}`}
                        className="flex-1 bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Summary Compilation & Review */}
            {wizardStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs uppercase tracking-wider font-bold text-gray-300 font-mono">// System Provision Review Blueprint</p>
                
                <div className="bg-[#4B5563]/40 border border-gray-500/30 p-5 rounded-2xl space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Target Consensus Invariant</span>
                    <p className="text-sm font-bold text-white mt-1 italic">{pollQuestion}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Compiled Options Matrix Array</span>
                    {pollOptions.filter(o => o.trim() !== '').map((o, idx) => (
                      <div key={idx} className="text-xs font-mono text-[#00F2FE] bg-[#374151] px-3 py-1.5 rounded border border-gray-500/20">
                        {idx + 1} // {o}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Absolute Success Node Status */}
            {wizardStep === 4 && (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="mx-auto w-12 h-12 bg-cyan-500/10 border border-[#00F2FE] text-[#00F2FE] text-glow rounded-full flex items-center justify-center text-xl font-bold animate-bounce">
                  ✓
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight italic">Consensus Node Active</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto">The interactive verification poll has been injected globally into the public portal space.</p>
              </div>
            )}
          </div>

          {/* Wizard Action Controls Base */}
          {wizardStep <= 3 && (
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
                  if (wizardStep === 1) setWizardStep(2);
                  else if (wizardStep === 2) setWizardStep(3);
                  else triggerPollDeployment();
                }}
                disabled={
                  (wizardStep === 1 && !pollQuestion.trim()) ||
                  (wizardStep === 2 && pollOptions.filter(o => o.trim() !== '').length < 2) ||
                  isPollDeploying
                }
                className={`py-3 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all focus:outline-none disabled:opacity-45 disabled:cursor-not-allowed ${
                  wizardStep === 1 ? 'w-full' : 'w-3/4'
                }`}
              >
                {isPollDeploying 
                  ? "Compiling Poll Array Stack..." 
                  : wizardStep === 3 
                    ? "Inject Poll Globally" 
                    : "Continue Matrix"
                }
              </button>
            </div>
          )}

          {wizardStep === 4 && (
            <button 
              onClick={handleResetWizard}
              className="w-full mt-8 py-3 bg-[#4B5563] border border-gray-500/40 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-gray-600 focus:outline-none"
            >
              Return to Module Control
            </button>
          )}

        </section>
      )}

    </div>
  );
}