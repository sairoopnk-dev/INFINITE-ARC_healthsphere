"use client";

import React from "react";
import { 
  Users, AlertCircle, TrendingUp, CheckCircle, 
  Clock, Calendar, UserPlus, MessageSquare
} from "lucide-react";

export const DailySummary = ({ totalToday, priorityCount }: { totalToday: number, priorityCount: number }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Daily Summary</h3>
        <TrendingUp size={18} className="text-blue-500" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
          <p className="text-2xl font-black text-blue-600">{totalToday}</p>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Total Appts</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50">
          <p className="text-2xl font-black text-amber-600">{priorityCount}</p>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-1">Priority</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle size={14} />
          </div>
          <p className="text-xs font-bold text-slate-700">3 patients seen so far</p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <Clock size={14} />
          </div>
          <p className="text-xs font-bold text-slate-700">Avg. 15m per session</p>
        </div>
      </div>
    </div>
  );
};

export const ActivityPanel = () => {
  const activities = [
    { type: "patient", text: "New patient Sarah J. added", time: "10m ago", icon: UserPlus, color: "text-green-500", bg: "bg-green-50" },
    { type: "message", text: "New message from Dr. Smith", time: "25m ago", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
    { type: "record", text: "Lab results updated for John D.", time: "1h ago", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
        <AlertCircle size={18} className="text-slate-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-4 group cursor-pointer">
            <div className={`w-10 h-10 ${act.bg} ${act.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <act.icon size={18} />
            </div>
            <div className="flex-1 min-w-0 border-b border-slate-50 pb-3 last:border-0">
              <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">{act.text}</p>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="text-xs font-black text-blue-600 hover:text-blue-700 text-center pt-2">
        View All Activity
      </button>
    </div>
  );
};

export const QuickStatsDoc = ({ seenThisWeek, upcoming }: { seenThisWeek: number, upcoming: number }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-5 text-white shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <Users size={20} />
        </div>
        <p className="text-2xl font-black">{seenThisWeek}</p>
        <p className="text-[10px] font-bold text-teal-100 uppercase tracking-widest">Seen this week</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 text-white shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <Calendar size={20} />
        </div>
        <p className="text-2xl font-black">{upcoming}</p>
        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Upcoming</p>
      </div>
    </div>
  );
};
