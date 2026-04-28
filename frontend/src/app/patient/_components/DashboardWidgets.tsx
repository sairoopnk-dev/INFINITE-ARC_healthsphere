"use client";

import React from "react";
import { 
  Calendar, Stethoscope, FileText, Activity, 
  Clock, Pill, ArrowRight, Plus, HeartPulse
} from "lucide-react";
import Link from "next/link";

export const QuickActions = ({ openAppt }: { openAppt: () => void }) => {
  const actions = [
    { label: "Book Appointment", icon: Calendar, color: "text-teal-600", bg: "bg-teal-50", onClick: openAppt },
    { label: "Check Symptoms", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50", href: "/patient/symptom-checker" },
    { label: "View Records", icon: FileText, color: "text-purple-600", bg: "bg-purple-50", href: "/patient/medical-records" },
    { label: "Medication Reminders", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", href: "/patient/medicine-reminders" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action, i) => (
        action.href ? (
          <Link 
            key={i} 
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group"
          >
            <div className={`w-10 h-10 ${action.bg} ${action.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="font-bold text-slate-700 text-sm">{action.label}</span>
          </Link>
        ) : (
          <button 
            key={i} 
            onClick={action.onClick}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group text-left w-full"
          >
            <div className={`w-10 h-10 ${action.bg} ${action.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="font-bold text-slate-700 text-sm">{action.label}</span>
          </button>
        )
      ))}
    </div>
  );
};

export const HealthSummary = ({ lastSymptoms, recentActivity }: { lastSymptoms?: string[], recentActivity?: string }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Health Summary</h4>
        <HeartPulse size={18} className="text-teal-500 animate-pulse" />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Last Symptoms Checked</p>
          <div className="flex flex-wrap gap-2">
            {lastSymptoms?.length ? lastSymptoms.map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold border border-teal-100/50">
                {s}
              </span>
            )) : <span className="text-xs text-slate-400 font-medium italic">No recent logs</span>}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recent Activity</p>
          <p className="text-sm font-bold text-slate-700">{recentActivity || "All systems stable"}</p>
        </div>
      </div>

      <Link href="/patient/timeline" className="mt-2 text-xs font-black text-teal-600 hover:text-teal-700 flex items-center gap-1 group">
        Full Timeline <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export const UpcomingHighlight = ({ appointment }: { appointment?: any }) => {
  if (!appointment) return null;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-blue-200" />
          <span className="text-xs font-black uppercase tracking-widest text-blue-100">Next Appointment</span>
        </div>
        
        <h4 className="text-xl font-black mb-1">{appointment.doctorName}</h4>
        <p className="text-blue-100 text-sm font-medium">{appointment.hospital}</p>
        
        <div className="mt-4 flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Time</p>
            <p className="text-sm font-black">{appointment.timeSlot}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Date</p>
            <p className="text-sm font-black">{appointment.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
