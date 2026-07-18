import React from 'react';

export default function AdminDashboardIndex() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Informational Welcome Matrix banner */}
      <header className="bg-[#374151] border border-gray-500/40 p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00F2FE]/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F2FE] uppercase block mb-1">
          // ACCESS GRANTED // TERMINAL ONLINE
        </span>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
          System Control Matrix Overview
        </h2>
        <p className="text-xs text-gray-300 max-w-xl mt-2 leading-relaxed">
          Operational infrastructure active. Use the top network gateway nodes to jump inside active forum data buckets, review user web inquiries, adjust help desk assignments, or configure blog streams.
        </p>
      </header>

      {/* Primary Infrastructure Diagnostic Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Node Pipeline Status", metric: "Operational", color: "text-emerald-400" },
          { title: "Total Pending Inquiries", metric: "14 Nodes Unresolved", color: "text-[#00F2FE]" },
          { title: "System Delta Latency", metric: "0.04ms Edge Loop", color: "text-gray-300" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#374151] border border-gray-500/40 p-6 rounded-2xl shadow-md">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">{stat.title}</span>
            <span className={`text-xl font-black uppercase italic tracking-wide mt-2 block ${stat.color}`}>
              {stat.metric}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}