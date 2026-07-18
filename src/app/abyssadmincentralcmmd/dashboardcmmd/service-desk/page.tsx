"use client";
import React, { useState } from 'react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  clientPhone: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
}

// Mock Telemetry Data matching our core database layout blueprint
const initialTickets: SupportTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-1024",
    clientName: "Marcus Vance",
    clientPhone: "+15550198822",
    subject: "Stripe Webhook Handshake Failing in Production",
    description: "The payment verification sequence is hitting a 500 error on the validation route loop. Users are getting charged but database flags remain stagnant.",
    priority: "critical",
    status: "open",
    date: "10 mins ago"
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-1025",
    clientName: "Elena Rostova",
    clientPhone: "+15550174411",
    subject: "Custom CSS Grid Breakage on Mobile Topologies",
    description: "The interactive slider module container is clipping outside the standard viewport margins when viewed on display layouts under 390px.",
    priority: "medium",
    status: "in_progress",
    date: "2 hours ago"
  },
  {
    id: "tkt-3",
    ticketNumber: "TKT-1026",
    clientName: "Devon Cross",
    clientPhone: "+15550123399",
    subject: "Database Vector Index Sync Timeout Error",
    description: "Manual indexing updates are triggering memory collection timeouts during the secondary delta validation sweep.",
    priority: "high",
    status: "resolved",
    date: "1 day ago"
  }
];

export default function ServiceDeskDashboard(): React.JSX.Element {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [activeFilter, setActiveFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  
  // Workspace workbench states for active messaging compilation
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [smsWorkbenchNotes, setSmsWorkbenchNotes] = useState<Record<string, string>>({});

  // ----------------------------------------------------
  // Core Telemetry State Mutations (Fixed Syntax Errors)
  // ----------------------------------------------------
  const updateTicketStatus = (id: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const updateTicketPriority = (id: string, newPriority: 'low' | 'medium' | 'high' | 'critical') => {
    setTickets(tickets.map(t => t.id === id ? { ...t, priority: newPriority } : t));
  };

  const handleNotesChange = (id: string, val: string) => {
    setSmsWorkbenchNotes({ ...smsWorkbenchNotes, [id]: val });
  };

  // ----------------------------------------------------
  // Dynamic SMS Action Compiler Pipeline
  // ----------------------------------------------------
  const compileTicketSmsLink = (ticket: SupportTicket) => {
    const customNotes = smsWorkbenchNotes[ticket.id] || "";
    
    // Dynamic text payload binding ticket numbers and extra information parameters
    let basePayload = `ABYSS SERVICE DESK // Ref: [${ticket.ticketNumber}]\n`;
    basePayload += `Status: ${ticket.status.toUpperCase()} // Priority: ${ticket.priority.toUpperCase()}\n\n`;
    basePayload += `Regarding your issue: "${ticket.subject}"\n\n`;
    
    if (customNotes.trim()) {
      basePayload += `Diagnostic Update:\n${customNotes}`;
    } else {
      basePayload += `Our squad is actively running structural evaluations inside your operational workspace cluster. We will keep you updated.`;
    }

    return `sms:${ticket.clientPhone}?body=${encodeURIComponent(basePayload)}`;
  };

  // Safe data array filtering execution block above return statement
  const visibleTickets = tickets.filter(t => {
    if (activeFilter === "all") return true;
    return t.status === activeFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Platform Diagnostic Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#374151] border border-gray-500/40 p-6 rounded-3xl shadow-lg gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block">// MODULE :: SERVICE_DESK</span>
          <h2 className="text-2xl font-black text-white uppercase italic mt-1">Incident Management Terminal</h2>
        </div>

        {/* Status Pipeline Grid Controllers */}
        <div className="flex flex-wrap bg-[#4B5563] p-1 border border-gray-500/20 rounded-xl gap-1">
          {(["all", "open", "in_progress", "resolved"] as const).map((filter) => {
            const count = filter === "all" ? tickets.length : tickets.filter(t => t.status === filter).length;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
                  activeFilter === filter 
                    ? 'bg-[#00B8C4] text-gray-900 shadow-md font-black' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {filter.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Structural Ticket Matrix Grid Feed */}
      <section className="space-y-4">
        {visibleTickets.length === 0 ? (
          <div className="text-center py-16 bg-[#374151]/40 border border-gray-500/20 rounded-2xl text-xs font-mono text-gray-400 uppercase tracking-wider">
            Clear Queue: No active tickets found matching operational scope criteria.
          </div>
        ) : (
          visibleTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            
            // Local parsing priorities color mapping
            const priorityColors = {
              low: "border-gray-500 text-gray-400 bg-gray-500/5",
              medium: "border-sky-500 text-sky-400 bg-sky-500/5",
              high: "border-amber-500 text-amber-400 bg-amber-500/5",
              critical: "border-rose-500 text-rose-400 bg-rose-500/5 text-glow shadow-[0_0_10px_rgba(244,63,94,0.1)]"
            };

            return (
              <div 
                key={ticket.id}
                className={`bg-[#374151] border rounded-3xl shadow-md transition-all ${
                  isExpanded ? 'border-[#00F2FE]' : 'border-gray-500/40 hover:border-gray-400'
                } p-6 space-y-4`}
              >
                {/* Meta Component Row Summary */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-500/20 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-[#00F2FE] bg-[#4B5563] px-2.5 py-0.5 rounded border border-gray-500/20 shadow-inner">
                        {ticket.ticketNumber}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">Reporter: <strong className="text-gray-200">{ticket.clientName}</strong></span>
                    </div>
                    <h3 className="text-base font-bold text-white uppercase italic tracking-wide pt-1">
                      {ticket.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-400 text-left md:text-right block">Logged: {ticket.date}</span>
                    <button
                      type="button"
                      onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                      className="px-4 py-2 bg-[#4B5563] border border-gray-500/30 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl hover:border-white transition-all focus:outline-none"
                    >
                      {isExpanded ? "Collapse Workbench" : "Open Workbench Matrix"}
                    </button>
                  </div>
                </div>

                {/* Base Incident Description Body */}
                <p className="text-xs text-gray-300 leading-relaxed bg-[#4B5563]/20 border border-gray-500/10 p-4 rounded-xl">
                  {ticket.description}
                </p>

                {/* ----------------------------------------------------
                    INTERACTIVE WORKBENCH DRAWER
                ---------------------------------------------------- */}
                {isExpanded && (
                  <div className="pt-4 border-t border-gray-500/20 grid lg:grid-cols-12 gap-6 animate-fadeIn">
                    
                    {/* Left Workbench Panel: Metric Adjustments */}
                    <div className="lg:col-span-4 space-y-4 border-r border-gray-500/20 pr-4">
                      {/* Status Adjustments Cluster */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">Incident Step State</label>
                        <div className="grid grid-cols-3 gap-1 bg-[#4B5563]/40 p-1 rounded-xl border border-gray-500/20">
                          {(["open", "in_progress", "resolved"] as const).map((statusState) => (
                            <button
                              key={statusState}
                              type="button"
                              onClick={() => updateTicketStatus(ticket.id, statusState)}
                              className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                ticket.status === statusState 
                                  ? 'bg-[#00B8C4] text-gray-900 font-black' 
                                  : 'text-gray-300 hover:text-white'
                              }`}
                            >
                              {statusState.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Priority Level Overrides */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 block">Critical Overrides</label>
                        <div className="grid grid-cols-4 gap-1 bg-[#4B5563]/40 p-1 rounded-xl border border-gray-500/20">
                          {(["low", "medium", "high", "critical"] as const).map((prioState) => (
                            <button
                              key={prioState}
                              type="button"
                              onClick={() => updateTicketPriority(ticket.id, prioState)}
                              className={`py-1.5 text-[8px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                ticket.priority === prioState 
                                  ? 'bg-white text-gray-900 font-black' 
                                  : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              {prioState}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Workbench Panel: Dynamic Outbound Text Compiler */}
                    <div className="lg:col-span-8 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">
                            Outbound Additional Information (SMS Body Extension)
                          </label>
                          <span className="text-[9px] font-mono text-gray-400">Target Line: {ticket.clientPhone}</span>
                        </div>
                        <textarea
                          rows={3}
                          value={smsWorkbenchNotes[ticket.id] || ""}
                          onChange={(e) => handleNotesChange(ticket.id, e.target.value)}
                          placeholder="Inject structural diagnostics or resolution timelines to compile into client text framework..."
                          className="w-full bg-[#4B5563] border border-gray-500/40 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#00F2FE] resize-none"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <a
                          href={compileTicketSmsLink(ticket)}
                          className="px-6 py-3 bg-gradient-to-r from-[#00B8C4] to-[#00F2FE] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center gap-2 border-none focus:outline-none"
                        >
                          💬 Deploy SMS Response Node →
                        </a>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </section>

    </div>
  );
}